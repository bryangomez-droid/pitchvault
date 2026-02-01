const grid = document.getElementById("grid");
const count = document.getElementById("count");

const q = document.getElementById("q");
const surface = document.getElementById("surface");

const dlg = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbSub = document.getElementById("lbSub");
const lbNotes = document.getElementById("lbNotes");

let items = [];

function cardTemplate(t) {
  const marca = t.marca ? `· ${t.marca}` : "";
  const color = t.color ? `· ${t.color}` : "";
  return `
    <article class="card">
      <button class="card__media" data-open>
        <img src="${t.imagen}" alt="${t.nombre}" loading="lazy" />
      </button>
      <div class="card__body">
        <h3 class="card__title">${t.nombre}</h3>
        <p class="card__sub">${t.superficie} ${marca} ${color}</p>
        <div class="chiprow">
          <span class="chip">${t.superficie}</span>
          ${t.marca ? `<span class="chip chip--ghost">${t.marca}</span>` : ""}
        </div>
      </div>
    </article>
  `;
}

function render() {
  const query = (q.value || "").toLowerCase().trim();
  const sf = surface.value;

  const filtered = items.filter(t => {
    const hay = `${t.nombre} ${t.marca || ""} ${t.superficie} ${t.color || ""} ${t.notas || ""}`.toLowerCase();
    const okQuery = query ? hay.includes(query) : true;
    const okSurface = sf ? t.superficie === sf : true;
    return okQuery && okSurface;
  });

  grid.innerHTML = filtered.map(cardTemplate).join("");
  count.textContent = `${filtered.length} modelo(s)`;

  // Lightbox
  [...grid.querySelectorAll("[data-open]")].forEach((btn, i) => {
    btn.addEventListener("click", () => {
      const t = filtered[i];
      lbImg.src = t.imagen;
      lbImg.alt = t.nombre;
      lbTitle.textContent = t.nombre;
      lbSub.textContent = `${t.superficie}${t.marca ? " · " + t.marca : ""}${t.color ? " · " + t.color : ""}`;
      lbNotes.textContent = t.notas || "";
      dlg.showModal();
    });
  });
}

async function init() {
  const res = await fetch("/data/tacos.json", { cache: "no-store" });
  const json = await res.json();
  items = Array.isArray(json.items) ? json.items : [];
  render();
}

q.addEventListener("input", render);
surface.addEventListener("change", render);

dlg.addEventListener("click", (e) => {
  const box = dlg.getBoundingClientRect();
  const inDialog = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
  if (!inDialog) dlg.close();
});
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => dlg.close()));
document.getElementById("year").textContent = new Date().getFullYear();

init();
