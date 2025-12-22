const mapContainer = document.getElementById("map-container");
const select = document.getElementById("citySelect");
const list = document.getElementById("list");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let ecologyData = {};
let originalViewBox = "";

/* SVG YÜKLE */
fetch("country.svg")
  .then(r => r.text())
  .then(svg => {
    mapContainer.innerHTML = svg;

    const svgEl = mapContainer.querySelector("svg");
    originalViewBox = svgEl.getAttribute("viewBox");

    loadData();
    bindMapClicks();
  });

/* JSON */
function loadData() {
  fetch("ecology.json")
    .then(r => r.json())
    .then(data => {
      ecologyData = data;
      fillSelectFromSVG();
      addLabels();
    });
}

/* SELECT DOLDUR (SVG'DEN) */
function fillSelectFromSVG() {
  document.querySelectorAll("svg g[data-iladi]").forEach(g => {
    const id = g.id;
    const name = g.dataset.iladi;

    if (!ecologyData[id]) return;

    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

/* HARİTA ÜZERİNE İSİM */
function addLabels() {
  const svg = mapContainer.querySelector("svg");

  document.querySelectorAll("svg g[data-iladi]").forEach(g => {
    const id = g.id;
    if (!ecologyData[id]) return;

    const box = g.getBBox();
    if (box.width < 30 || box.height < 30) return;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = g.dataset.iladi;
    text.setAttribute("x", box.x + box.width / 2);
    text.setAttribute("y", box.y + box.height / 2);
    text.setAttribute("class", "map-label");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("pointer-events", "none");

    svg.appendChild(text);
  });
}

/* TIKLAMA */
function bindMapClicks() {
  document.querySelectorAll("svg g[data-iladi]").forEach(g => {
    g.style.cursor = "pointer";
    g.addEventListener("click", () => handleSelect(g.id));
  });
}

/* DROPDOWN */
select.addEventListener("change", e => {
  if (e.target.value) handleSelect(e.target.value);
});

/* ORTAK */
function handleSelect(id) {
  if (!ecologyData[id]) return;

  zoomTo(id);
  showList(id);
  showModal(id);
}

/* ZOOM */
function zoomTo(id) {
  const svg = mapContainer.querySelector("svg");
  const el = document.getElementById(id);
  const box = el.getBBox();
  const pad = 30;

  svg.setAttribute(
    "viewBox",
    `${box.x - pad} ${box.y - pad} ${box.width + pad*2} ${box.height + pad*2}`
  );
}

/* LİSTE */
function showList(id) {
  const d = ecologyData[id];
  let html = `<h3>${d.city}</h3>`;

  d.actions.forEach(a => {
    html += `
      <div class="action">
        <strong>${a.title}</strong>
        <small>${a.years}</small>
        <p>${a.desc}</p>
      </div>`;
  });

  list.innerHTML = html;
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
