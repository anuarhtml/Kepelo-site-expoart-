/* =====================================================================
   KE'PELO — script.js
   Datos de productos separados de la estructura visual.
   ===================================================================== */

const WHATSAPP_NUMBER = "573145804182";

const PRODUCTS = [
  {
    id: "shampoo-natural",
    name: "Shampoo Natural",
    size: "250–300 ml",
    price: 17900,
    desc: "Limpieza suave que fortalece y revitaliza con sábila e ingredientes naturales.",
    photo: "shampoo.jpg",
    inStock: true
  },
  {
    id: "acondicionador-natural",
    name: "Acondicionador Natural",
    size: "250 ml",
    price: 17900,
    desc: "Desenreda, suaviza y sella la hidratación. Sin sal, para todo tipo de cabello.",
    photo: "acondicionador.jpg",
    inStock: true
  },
  {
    id: "tonico-capilar",
    name: "Tónico Capilar",
    size: "120–250 ml",
    price: 12500,
    desc: "Fortalece el folículo, estimula el crecimiento y ayuda a prevenir la caída.",
    photo: "tonico.jpg",
    inStock: true
  },
  {
    id: "perfume-capilar",
    name: "Perfume Capilar",
    size: "120 ml",
    price: 15900,
    desc: "Aroma natural y fresco, apto para todo tipo de cabello. Ideal después del lavado.",
    photo: "tonico-spray.jpg",
    inStock: true
  },
  {
    id: "mascarilla-reparadora",
    name: "Mascarilla Tratamiento",
    size: "200 ml",
    price: 17900,
    desc: "Tratamiento profundo que nutre e hidrata desde la raíz con aceite de coco.",
    photo: "mascarilla.jpg",
    inStock: true
  },
  {
    id: "aceite-romero",
    name: "Aceite Regenerador de Romero",
    size: "100 ml",
    price: 16900,
    desc: "Estimula el crecimiento y fortalece el folículo. Ideal como pre-lavado o en puntas.",
    photo: "aceite.jpg",
    inStock: true
  },
  {
    id: "esencia-fresca",
    name: "Esencia Fresca (Set)",
    size: "Tónico + Perfume",
    price: 26900,
    desc: "Nuestro dúo más pedido: tónico fortalecedor y perfume capilar juntos.",
    photo: "lineup.jpg",
    inStock: true
  }
];

const money = (n) => "$" + n.toLocaleString("es-CO");

/* ---------------------------- Render catálogo ---------------------------- */
function renderCatalog() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => `
    <article class="product-card">
      <div class="product-photo-wrap">
        <img class="product-photo" src="${p.photo}" alt="${p.name} KE'PELO, ${p.size}" loading="lazy" width="400" height="420">
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="size">${p.size}</p>
        <p class="desc">${p.desc}</p>
        <div class="product-foot">
          <span class="price">${money(p.price)}</span>
          ${p.inStock
            ? `<button class="add-btn" data-add="${p.id}">Agregar</button>`
            : `<button class="add-btn" disabled>Agotado</button>`}
        </div>
      </div>
    </article>
  `).join("");
}

/* ------------------------------- Carrito -------------------------------- */
const CART_KEY = "kepelo_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
  openDrawer();
}
function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}
function removeFromCart(id) {
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartTotalCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}
function cartTotalPrice() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function renderCart() {
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cartTotalCount();

  const itemsEl = document.getElementById("drawerItems");
  if (!itemsEl) return;

  const entries = Object.entries(cart);

  if (entries.length === 0) {
    itemsEl.innerHTML = `<p class="drawer-empty">Tu carrito está vacío.<br>Explora el catálogo y agrega tus productos favoritos.</p>`;
  } else {
    itemsEl.innerHTML = entries.map(([id, qty]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (!p) return "";
      return `
        <div class="drawer-item">
          <div>
            <div class="name">${p.name}</div>
            <div class="meta">${p.size} · ${money(p.price)}</div>
            <div class="qty-controls">
              <button data-qty="${id}" data-delta="-1" aria-label="Restar uno de ${p.name}">–</button>
              <span>${qty}</span>
              <button data-qty="${id}" data-delta="1" aria-label="Sumar uno de ${p.name}">+</button>
              <button class="remove-link" data-remove="${id}">Quitar</button>
            </div>
          </div>
          <div class="name">${money(p.price * qty)}</div>
        </div>
      `;
    }).join("");
  }

  const totalEl = document.getElementById("drawerTotal");
  if (totalEl) totalEl.textContent = money(cartTotalPrice());
  updateWhatsappLink();
}

function updateWhatsappLink() {
  const entries = Object.entries(cart);
  const link = document.getElementById("whatsappOrder");
  if (!link) return;

  if (entries.length === 0) {
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola KE'PELO, quiero hacer un pedido.")}`;
    return;
  }

  let msg = "Hola KE'PELO, quiero pedir:\n";
  entries.forEach(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) msg += `• ${p.name} (${p.size}) x${qty} — ${money(p.price * qty)}\n`;
  });
  msg += `\nTotal: ${money(cartTotalPrice())}`;

  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* -------------------------------- Drawer --------------------------------- */
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function openDrawer() {
  if (drawer) drawer.classList.add("open");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

const cartBtn = document.getElementById("cartBtn");
const drawerClose = document.getElementById("drawerClose");
if (cartBtn) cartBtn.addEventListener("click", openDrawer);
if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
if (overlay) overlay.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDrawer();
    closeMenu();
  }
});

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) addToCart(addBtn.dataset.add);

  const qtyBtn = e.target.closest("[data-qty]");
  if (qtyBtn) changeQty(qtyBtn.dataset.qty, Number(qtyBtn.dataset.delta));

  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) removeFromCart(removeBtn.dataset.remove);
});

/* ------------------------------ Menú móvil -------------------------------- */
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");

function closeMenu() {
  if (navLinks) navLinks.classList.remove("open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
}
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
if (navLinks) {
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
}

/* ------------------------------ Encuesta ------------------------------ */
const surveyForm = document.getElementById("surveyForm");
const surveyStatus = document.getElementById("surveyStatus");
const surveySubmit = document.getElementById("surveySubmit");

function encodeFormData(form) {
  return new URLSearchParams(new FormData(form)).toString();
}

if (surveyForm) {
  surveyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (surveySubmit) {
      surveySubmit.disabled = true;
      surveySubmit.textContent = "Enviando…";
    }
    if (surveyStatus) {
      surveyStatus.className = "survey-status";
      surveyStatus.textContent = "";
    }

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData(surveyForm)
    })
      .then((res) => {
        if (!res.ok) throw new Error("network");
        if (surveyStatus) {
          surveyStatus.className = "survey-status ok";
          surveyStatus.textContent = "¡Gracias por compartir tu experiencia con KE'PELO!";
        }
        surveyForm.reset();
      })
      .catch(() => {
        if (surveyStatus) {
          surveyStatus.className = "survey-status err";
          surveyStatus.textContent = "No pudimos enviar tu opinión. Por favor, inténtalo de nuevo.";
        }
      })
      .finally(() => {
        if (surveySubmit) {
          surveySubmit.disabled = false;
          surveySubmit.textContent = "Enviar mi opinión";
        }
      });
  });
}

/* --------------------------------- Init ---------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
renderCatalog();
renderCart();
