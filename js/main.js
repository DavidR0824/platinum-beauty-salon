(function () {
  "use strict";

  var html = document.documentElement;
  html.classList.remove("no-js");
  html.classList.add("js");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) html.classList.add("reduced-motion");

  /**
   * Analytics hook — ready for GA4 / GTM. No tracking ID is set here; add
   * your own gtag.js or GTM snippet in index.html <head>, this function will
   * then push events to window.dataLayer automatically. No personal data is
   * sent, only the action name and the related service/section.
   */
  function trackEvent(action, params) {
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push(Object.assign({ event: action }, params || {}));
    }
  }

  /* ---------------------------------------------------------------------
     WhatsApp links
     --------------------------------------------------------------------- */
  function wireWhatsAppLinks() {
    var defaultLinks = document.querySelectorAll(
      "#headerWhatsapp, #mobileWhatsapp, #heroWhatsapp, #locationWhatsapp, #finalCtaWhatsapp, #stickyWhatsapp"
    );
    defaultLinks.forEach(function (link) {
      link.href = buildWhatsAppLink();
      link.addEventListener("click", function () {
        trackEvent("whatsapp_click", { link_id: link.id || "whatsapp" });
      });
    });

    document.querySelectorAll("[data-wa]").forEach(function (link) {
      var service = link.getAttribute("data-wa-msg") || "";
      var message = service
        ? "Hola, me gustaría agendar una cita para " + service + " en Platinum Beauty Salon. ¿Me pueden compartir los horarios disponibles?"
        : PLATINUM_CONFIG.whatsappDefaultMessage;
      link.href = buildWhatsAppLink(message);
      link.target = "_blank";
      link.rel = "noopener";
      link.addEventListener("click", function () {
        trackEvent("whatsapp_click", { link_id: "service", service: service });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Header scroll state
     --------------------------------------------------------------------- */
  function wireHeaderScroll() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Mobile nav
     --------------------------------------------------------------------- */
  function wireMobileNav() {
    var toggle = document.getElementById("navToggle");
    var closeBtn = document.getElementById("navClose");
    var nav = document.getElementById("mobileNav");
    var stickyCta = document.querySelector(".sticky-cta");
    if (!toggle || !nav) return;

    function open() {
      nav.classList.add("is-open");
      nav.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (stickyCta) stickyCta.style.visibility = "hidden";
      var firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus();
    }
    function close() {
      nav.classList.remove("is-open");
      nav.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (stickyCta) stickyCta.style.visibility = "";
      toggle.focus();
    }

    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    nav.querySelectorAll(".mobile-link").forEach(function (link) {
      link.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) close();
    });
  }

  /* ---------------------------------------------------------------------
     Services tabs (accessible tablist pattern)
     --------------------------------------------------------------------- */
  function wireTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
    if (!tabs.length) return;

    function activate(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = !selected;
          panel.classList.toggle("is-active", selected);
        }
      });
      tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activate(tab); });
      tab.addEventListener("keydown", function (e) {
        var newIndex = null;
        if (e.key === "ArrowRight") newIndex = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") newIndex = (i - 1 + tabs.length) % tabs.length;
        if (newIndex !== null) {
          e.preventDefault();
          activate(tabs[newIndex]);
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Reviews carousel
     --------------------------------------------------------------------- */
  function wireReviewsCarousel() {
    var track = document.getElementById("reviewsTrack");
    var prev = document.getElementById("reviewsPrev");
    var next = document.getElementById("reviewsNext");
    if (!track || !prev || !next) return;

    function cardStep() {
      var card = track.querySelector(".review-card");
      return card ? card.getBoundingClientRect().width + 24 : 320;
    }

    function scrollByCard(direction) {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (direction > 0 && atEnd) {
        track.scrollTo({ left: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        return;
      }
      track.scrollBy({
        left: cardStep() * direction,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }

    prev.addEventListener("click", function () { scrollByCard(-1); stopAutoplay(); });
    next.addEventListener("click", function () { scrollByCard(1); stopAutoplay(); });

    // Auto-advance to the left, like a slow-moving carousel. Pauses on
    // hover/focus/touch so visitors can read a card, and never runs when
    // the visitor prefers reduced motion.
    var autoplayId = null;
    function startAutoplay() {
      if (prefersReducedMotion || autoplayId) return;
      autoplayId = window.setInterval(function () { scrollByCard(1); }, 4500);
    }
    function stopAutoplay() {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    ["mouseenter", "focusin", "touchstart"].forEach(function (evt) {
      track.addEventListener(evt, stopAutoplay, { passive: true });
    });
    ["mouseleave", "focusout"].forEach(function (evt) {
      track.addEventListener(evt, startAutoplay, { passive: true });
    });

    startAutoplay();
  }

  /* ---------------------------------------------------------------------
     Scroll reveal animations (GSAP) with reduced-motion fallback
     --------------------------------------------------------------------- */
  /**
   * Safety net: if GSAP/ScrollTrigger never finish animating an element
   * (e.g. a throttled/background tab stalls requestAnimationFrame), force
   * it visible after a short delay instead of leaving it permanently hidden.
   */
  function revealFallback(selector) {
    window.setTimeout(function () {
      document.querySelectorAll(selector).forEach(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) < 1) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
    }, 2500);
  }

  function wireReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (prefersReducedMotion || typeof gsap === "undefined") {
      targets.forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    html.classList.add("gsap-ready");
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

    targets.forEach(function (el, index) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: (index % 4) * 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      });
    });

    revealFallback("[data-reveal]");
  }

  function wireHeroEntrance() {
    if (prefersReducedMotion || typeof gsap === "undefined") return;
    var tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.8 } });
    tl.from(".hero-title", { opacity: 0, y: 20 })
      .from(".hero-text", { opacity: 0, y: 20 }, "-=0.55")
      .from(".hero-actions", { opacity: 0, y: 16 }, "-=0.5")
      .from(".hero-meta", { opacity: 0, y: 16 }, "-=0.45");

    revealFallback(".hero-title, .hero-text, .hero-actions, .hero-meta");
  }

  /* ---------------------------------------------------------------------
     Misc
     --------------------------------------------------------------------- */
  function setFooterYear() {
    var el = document.getElementById("currentYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireWhatsAppLinks();
    wireHeaderScroll();
    wireMobileNav();
    wireTabs();
    wireReviewsCarousel();
    setFooterYear();

    // GSAP loads with `defer`; by DOMContentLoaded it is typically ready,
    // but guard just in case by waiting one tick for window 'load'.
    if (typeof gsap === "undefined") {
      window.addEventListener("load", function () {
        wireReveal();
        wireHeroEntrance();
      });
    } else {
      wireReveal();
      wireHeroEntrance();
    }
  });
})();
