/**
 * Datos centralizados del negocio.
 * Actualiza aquí el número de WhatsApp, enlaces sociales, horarios, etc.
 * y se reflejará en todo el sitio automáticamente.
 */
const PLATINUM_CONFIG = {
  businessName: "Platinum Beauty Salon",
  legalCity: "Managua, Nicaragua",
  address: {
    line1: "Centro Comercial Galerías, Pista Jean Paul Génie",
    line2: "Galerías Santo Domingo, Managua, Nicaragua",
    plusCode: "4Q32+F7 Managua",
    lat: 12.1037286,
    lng: -86.2492657
  },
  phoneDisplay: "+505 2276-5434",
  phoneHref: "tel:+50522765434",
  whatsappNumber: "50587759275",
  whatsappDisplay: "+505 8775 9275",
  whatsappDefaultMessage:
    "Hola, me gustaría agendar una cita en Platinum Beauty Salon. ¿Me pueden compartir los horarios disponibles?",
  email: "platiniumspa@gmail.com",
  facebookUrl: "https://www.facebook.com/PlatinumBeautySalonNic/",
  instagramUrl: "https://www.instagram.com/platinumsalonnicaragua/",
  googleMapsUrl: "https://maps.app.goo.gl/MBtBWCvACTNgD8nq9",
  googleReviewsUrl: "https://maps.app.goo.gl/MBtBWCvACTNgD8nq9",
  googleMapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.12296071957!2d-86.25184062596358!3d12.1037338333131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f73fe18f3b3b78f%3A0x612c1e77e37d3e2a!2sPlatinum%20Beauty%20Salon!5e0!3m2!1sen!2sni!4v1793225930689!5m2!1sen!2sni",
  rating: {
    value: 4.9,
    count: 351
  },
  hours: {
    label: "Todos los días, 9:00 a.m. – 6:00 p.m.",
    schema: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        opens: "09:00",
        closes: "18:00"
      }
    ]
  }
};

/** Construye un enlace de WhatsApp con mensaje opcional. */
function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message || PLATINUM_CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${PLATINUM_CONFIG.whatsappNumber}?text=${text}`;
}
