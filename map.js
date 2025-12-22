const mapContainer = document.getElementById("map-container");
const select = document.getElementById("citySelect");
const list = document.getElementById("list");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let ecologyData = {};

/* SVG YÜKLE */
fetch("country.svg")
  .then(r => r.text())
  .then(svg => {
    mapContainer.innerHTML = svg;
    loadData();
    bindMap();
  });

/* JSON */
function loadData() {
  fetch("ecology.json")
    .then(r => r.json())
    .then(data => {
      ecologyData = data;

      Object.keys(ecologyData).forEach(id => {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = ecologyData[id].city;
        select.appendChild(opt);
      });

      addLabels();
    });
}

/* İL İSİMLERİ */
function addLabels() {
  const svg = mapContainer.querySelector("svg");

  Object.keys(ecologyData).forEach(id => {
    const region = svg.querySelector(`g#${id}`);
    if (!region) return;

    const box = region.getBBox();

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = ecologyData[id].city;
    text.setAttribute("x", box.x + box.width / 2);
    text.setAttribute("y", box.y + box.height / 2);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "map-label");

    svg.appendChild(text);
  });
}

/* HARİTA TIKLAMA */
function bindMap() {
  const svg = mapContainer.querySelector("svg");

  svg.querySelectorAll("g[id]").forEach(g => {
    g.style.cursor = "pointer";
    g.addEventListener("click", () => handleSelect(g.id));
  });
}

/* DROPDOWN */
select.addEventListener("change", e => {
  if (e.target.value) handleSelect(e.target.value);
});

/* ORTAK SEÇİM */
function handleSelect(id) {
  if (!ecologyData[id]) return;

  select.value = id;
  highlight(id);
  showList(id);
  showModal(id);
}

/* AKTİF İL */
function highlight(id) {
  document.querySelectorAll("svg g").forEach(g =>
    g.classList.remove("active")
  );
  const el = document.querySelector(`svg g#${id}`);
  if (el) el.classList.add("active");
}

/* LİSTE */
function showList(id) {
  const d = ecologyData[id];

  list.innerHTML = `
    <h3>${d.city}</h3>
    ${d.actions.map(a => `
      <div class="action">
        <strong>${a.title}</strong>
        <small>${a.years}</small>
        <p>${a.desc}</p>
      </div>
    `).join("")}
  `;
}

/* MODAL */
function showModal(id) {
  modalBody.innerHTML = `
    <h3>${ecologyData[id].city}</h3>
    <p>${ecologyData[id].actions.length} ekolojik mücadele</p>
  `;
  modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");
