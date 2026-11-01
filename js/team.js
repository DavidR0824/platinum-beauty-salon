/**
 * Equipo de Platinum Beauty Salon.
 */
const PLATINUM_TEAM = [
  { photo: "assets/images/team/team-01.png", name: "Olga", role: "Estilista" },
  { photo: "assets/images/team/team-02.png", name: "Tatiana", role: "Servicio al Cliente" },
  { photo: "assets/images/team/team-03.png", name: "Alba", role: "Experta Capilar" },
  { photo: "assets/images/team/team-04.png", name: "Amelia", role: "Manicurista" },
  { photo: "assets/images/team/team-05.png", name: "Ana", role: "Manicurista" },
  { photo: "assets/images/team/team-06.png", name: "Bayardo", role: "Estilista" },
  { photo: "assets/images/team/team-07.png", name: "Erika", role: "Estilista" },
  { photo: "assets/images/team/team-08.png", name: "Glenda", role: "Manicurista" },
  { photo: "assets/images/team/team-09.png", name: "Iris", role: "Community Manager" },
  { photo: "assets/images/team/team-10.png", name: "Maria", role: "Manicurista" },
  { photo: "assets/images/team/team-11.png", name: "Maryuri", role: "Estilista" }
];

function renderTeam() {
  const grid = document.getElementById("teamGrid");
  if (!grid) return;

  const frag = document.createDocumentFragment();

  PLATINUM_TEAM.forEach((member, index) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.setAttribute("data-reveal", "");

    const photoWrap = document.createElement("div");
    photoWrap.className = "team-photo";
    const img = document.createElement("img");
    img.src = member.photo;
    img.loading = "lazy";
    img.width = 220;
    img.height = 220;
    img.alt = member.name
      ? `${member.name}, ${member.role || "equipo"} de Platinum Beauty Salon`
      : `Integrante del equipo de Platinum Beauty Salon (foto ${index + 1})`;
    photoWrap.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = member.name || "Nombre pendiente";

    const role = document.createElement("p");
    role.className = "team-role" + (member.role ? "" : " is-pending");
    role.textContent = member.role || "Especialidad pendiente";

    card.appendChild(photoWrap);
    card.appendChild(name);
    card.appendChild(role);
    frag.appendChild(card);
  });

  grid.appendChild(frag);
}

document.addEventListener("DOMContentLoaded", renderTeam);
