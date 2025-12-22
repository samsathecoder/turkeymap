const mapContainer = document.getElementById("map-container");
const select = document.getElementById("citySelect");
const list = document.getElementById("list");

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

/* JSON YÜKLE */
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

/* LABEL EKLE */
function addLabels() {
  const svg = mapContainer.querySelector("svg");

  Object.keys(ecologyData).forEach(id => {
    const region = document.getElementById(id);
    if (!region) return;

    const box = region.getBBox();
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.textContent = ecologyData[id].city;
    text.setAttribute("x", box.x + box.width / 2);
    text.setAttribute("y", box.y + box.height / 2);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("class", "map-label");

    svg.appendChild(text);
  });
}

/* MAP TIKLAMA */
function bindMapClicks() {
  document.querySelectorAll("path").forEach(p => {
    p.addEventListener("click", () => {
      const id = p.id;
      if (ecologyData[id]) {
        select.value = id;
        zoomTo(id);
        showList(id);
        showModal(id);
      }
    });
  });
}

/* DROPDOWN */
select.addEventListener("change", e => {
  const id = e.target.value;
  if (!id) return;
  zoomTo(id);
  showList(id);
});

/* ZOOM */
function zoomTo(id) {
  const svg = mapContainer.querySelector("svg");
  const el = document.getElementById(id);
  const box = el.getBBox();
  svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
}

/* LİSTE */
function showList(id) {
  const data = ecologyData[id];
  let html = `<h3>${data.city}</h3>`;

  data.actions.forEach(a => {
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
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
function showModal(id) {
  if (!ecologyData[id]) return;

  modalBody.innerHTML = `
    <h3>${ecologyData[id].city}</h3>
    <p><strong>${ecologyData[id].actions.length}</strong> ekolojik mücadele</p>
  `;

  modal.classList.remove("hidden");
}


document.getElementById("closeModal").onclick = () => {
  modal.classList.add("hidden");
};
