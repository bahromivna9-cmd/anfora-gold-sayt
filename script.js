/* =========================================================
   Anfora Gold — sayt mantiqi.
   Ma'lumotlar data.js faylida (yoki admin.html orqali).
   ========================================================= */

/* ---------- mahsulotlarni yig'ish ----------
   AUTO      — Telegram kanaldan avtomatik (products.js)
   MANUAL_PRODUCTS — qo'lda qo'shilganlar (data.js)
   OVERRIDES — admin o'zgartirishlari: nom, holat, kategoriya, yashirish (data.js) */
const PRODUCTS = (() => {
  const auto = typeof AUTO !== "undefined" ? AUTO.products : [];
  const manual = typeof MANUAL_PRODUCTS !== "undefined" ? MANUAL_PRODUCTS : [];
  const ov = typeof OVERRIDES !== "undefined" ? OVERRIDES : {};
  const list = [...auto, ...manual]
    .map((p) => ({ status: "aniqlanmoqda", ...p, ...(ov[p.id] || {}) }))
    .filter((p) => !p.hidden && p.variants && p.variants.length)
    .map((p) => ({ ...p, img: p.img || (p.imgs && p.imgs[0]) || "favicon.svg", imgs: p.imgs && p.imgs.length ? p.imgs : [p.img].filter(Boolean) }));
  const newest = list.reduce((m, p) => (p.date > m ? p.date : m), "");
  const NEW_DAYS = 14;
  list.forEach((p) => {
    if (p.isNew === undefined && newest && p.date) p.isNew = (new Date(newest) - new Date(p.date)) / 864e5 <= NEW_DAYS;
  });
  return list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
})();
const FEATURED = (() => {
  const f = typeof FEATURED_ID !== "undefined" && PRODUCTS.find((p) => String(p.id) === String(FEATURED_ID));
  return f || PRODUCTS.find((p) => p.vlabel === "O'lcham" && p.variants.length >= 3 && p.status !== "sotilgan") || PRODUCTS[0];
})();

/* ---------- yordamchilar ---------- */
const $ = (s) => document.querySelector(s);
const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
const tgLink = (text) => `https://t.me/${CONTACT.telegram}?text=${encodeURIComponent(text)}`;
const byId = (id) => PRODUCTS.find((p) => String(p.id) === String(id));
const isSize = (p) => p.vlabel === "O'lcham";
const variantText = (p, v) => (isSize(p) ? `${v[0]} o'lcham — ${v[1]}` : `${v[0]} — ${v[1]}`);

function summary(p) {
  if (isSize(p)) {
    const s = p.variants.map((v) => v[0]);
    const w = p.variants.map((v) => parseFloat(v[1].replace(",", ".")));
    const fmt = (n) => n.toFixed(2).replace(".", ",");
    const wr = Math.min(...w) === Math.max(...w) ? fmt(w[0]) : `${fmt(Math.min(...w))}–${fmt(Math.max(...w))}`;
    return `${s[0] === s.at(-1) ? s[0] : `${s[0]}–${s.at(-1)}`} o'lcham · ${wr} g`;
  }
  if (p.vlabel === "Harf") return `${p.variants.length} xil harf · ${p.variants[0][1]} dan`;
  return p.variants.map((v) => v[1]).join(" + ");
}

const STATUS = {
  sotuvda: { label: "Sotuvda", cls: "ok" },
  aniqlanmoqda: { label: "Mavjudligini so'rang", cls: "ask" },
  buyurtmaga: { label: "Buyurtma asosida", cls: "ask" },
  sotilgan: { label: "Sotilgan", cls: "sold" },
};
const st = (p) => STATUS[p.status] || STATUS.aniqlanmoqda;
const isSold = (p) => p.status === "sotilgan";
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
const fmtDate = (d) => { if (!d) return ""; const [y, m, dd] = d.split("-").map(Number); return `${dd}-${MONTHS[m - 1]}, ${y}`; };
const grams = (w) => parseFloat(String(w).replace(",", ".")) || 0;
const money = (n) => Math.round(n / 1000) * 1000;
const fmtMoney = (n) => money(n).toLocaleString("ru-RU").replace(/\u00a0/g, " ") + " so'm";
const hasPrice = () => typeof SETTINGS !== "undefined" && Number(SETTINGS.pricePerGram) > 0;
// taxminiy narx: bitta variant yoki to'plam (hamma qismlar yig'indisi)
function estimate(p, vi) {
  if (!hasPrice()) return null;
  const choosable = isSize(p) || p.vlabel === "Harf";
  const g = choosable ? grams(p.variants[vi ?? 0][1]) : p.variants.reduce((s, v) => s + grams(v[1]), 0);
  return g * SETTINGS.pricePerGram;
}
function cardPrice(p) {
  if (!hasPrice()) return p.note || "So'rov bo'yicha";
  const choosable = isSize(p) || p.vlabel === "Harf";
  if (!choosable) return "≈ " + fmtMoney(estimate(p));
  const min = Math.min(...p.variants.map((v) => grams(v[1])));
  return "≈ " + fmtMoney(min * SETTINGS.pricePerGram) + " dan";
}

function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch {} }

const state = {
  cat: "all",
  query: "",
  favs: new Set(JSON.parse(safeGet("ag_favs") || "[]").map(String)),
  cart: JSON.parse(safeGet("ag_cart2") || "[]"),
};

/* ---------- filtrlar ---------- */
function renderFilters() {
  $("#cats").innerHTML = CATEGORIES.map((c) => {
    const p = c.id === "all" ? null : PRODUCTS.find((x) => x.cat === c.id && x.img);
    if (c.id !== "all" && !p) return "";
    const inner = p ? `<img src="${p.img}" alt="">` : icon(c.icon);
    return `<button class="cat ${state.cat === c.id ? "active" : ""}" data-cat="${c.id}"><span class="circle">${inner}</span>${c.name}</button>`;
  }).join("");
  $("#chips").innerHTML = CATEGORIES.filter((c) => c.id === "all" || PRODUCTS.some((x) => x.cat === c.id)).map(
    (c) => `<button class="chip ${state.cat === c.id ? "active" : ""}" data-cat="${c.id}">${c.name}</button>`
  ).join("");
}

/* ---------- katalog ---------- */
const PAGE = 24;
let shown = PAGE;
function renderGrid() {
  const q = state.query.toLowerCase();
  const list = PRODUCTS.filter(
    (p) => (state.cat === "all" || p.cat === state.cat) && (p.name + " " + summary(p) + " " + (p.note || "")).toLowerCase().includes(q)
  );
  $("#grid").innerHTML = list
    .slice(0, shown)
    .map(
      (p) => `<article class="card ${isSold(p) ? "sold" : ""}" data-open="${p.id}">
        <div class="img">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          ${isSold(p) ? `<span class="new sold-b">Sotilgan</span>` : p.isNew ? `<span class="new">Yangi</span>` : ""}
          <button class="cbtn sm fav ${state.favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Sevimli">${icon("i-heart")}</button>
        </div>
        <div class="body">
          <h3>${p.name}</h3>
          <p class="meta">${summary(p)}</p>
          <div class="foot"><b class="${hasPrice() ? "price-b" : ""}">${cardPrice(p)}</b>
            ${isSold(p) ? "" : `<button class="cbtn dark sm" data-add="${p.id}" aria-label="Savatga qo'shish">${icon("i-plus")}</button>`}
          </div>
        </div>
      </article>`
    )
    .join("");
  $("#empty").hidden = list.length > 0;
  $("#count").textContent = `${list.length} ta buyum`;
  const more = $("#more");
  more.hidden = list.length <= shown;
  more.textContent = `Yana ko'rsatish (${list.length - shown} ta qoldi)`;
}

function setCat(cat) {
  state.cat = cat;
  shown = PAGE;
  renderFilters();
  renderGrid();
}

/* ---------- mahsulot oynasi ---------- */
let modalP = null, modalV = 0;
function openModal(id) {
  modalP = byId(id);
  modalV = 0;
  renderModal();
  document.body.classList.add("modal-open");
}
function closeModal() { document.body.classList.remove("modal-open"); }
function renderModal() {
  const p = modalP, v = p.variants[modalV];
  const choosable = isSize(p) || p.vlabel === "Harf";
  if (!$("#mImg").dataset.keep) $("#mImg").src = p.img;
  $("#mImg").dataset.keep = "";
  $("#mThumbs").innerHTML = p.imgs.length > 1 ? p.imgs.map((src) => `<button data-thumb="${src}"><img src="${src}" alt=""></button>`).join("") : "";
  $("#mImg").alt = p.name;
  $("#mName").textContent = p.name;
  $("#mNote").textContent = p.note || CATEGORIES.find((c) => c.id === p.cat).name;
  const s = st(p);
  $("#mStatus").className = "status " + s.cls;
  $("#mStatus").textContent = s.label;
  $("#mDate").textContent = p.date ? `Telegram kanalda: ${fmtDate(p.date)}` : "";
  const est = estimate(p, modalV);
  $("#mPrice").innerHTML = est
    ? `Taxminiy narx: <b>${fmtMoney(est)}</b><br><small>1 gramm — ${fmtMoney(SETTINGS.pricePerGram)}${SETTINGS.priceDate ? " (" + fmtDate(SETTINGS.priceDate) + ")" : ""}. Aniq narx sotuvchi tomonidan tasdiqlanadi.</small>`
    : "Narx kunlik oltin kursiga qarab o'zgaradi — aniq narxni Telegram orqali so'rang.";
  $("#mAdd").hidden = isSold(p);
  $("#mLabel").textContent = choosable ? `${p.vlabel}ni tanlang` : p.vlabel;
  $("#mVariants").innerHTML = choosable
    ? `<div class="round-chips">${p.variants.map((x, i) => `<button class="${i === modalV ? "active" : ""}" data-mv="${i}">${x[0]}</button>`).join("")}</div>
       <p class="f-weight">Og'irligi: <b>${v[1]}</b></p>`
    : `<ul class="spec">${p.variants.map((x) => `<li><span>${x[0]}</span><b>${x[1]}</b></li>`).join("")}</ul>`;
  const what = choosable ? `${p.name} (${variantText(p, v)})` : `${p.name} (${p.variants.map((x) => variantText(p, x)).join(", ")})`;
  $("#mOrder").href = tgLink(`Assalomu alaykum! Saytdan yozyapman: ${what}. ${isSold(p) ? "Shunga o'xshash buyum bormi?" : "Narxi qancha va hozir bormi?"}`);
}
function addModalToCart() {
  const p = modalP;
  const choosable = isSize(p) || p.vlabel === "Harf";
  const v = p.variants[modalV];
  addToCart({
    key: choosable ? `${p.id}|${modalV}` : `${p.id}`,
    id: p.id,
    name: p.name,
    meta: choosable ? variantText(p, v) : summary(p),
  });
}

/* ---------- savat ---------- */
function addToCart(item) {
  const p = byId(item.id);
  if (p && isSold(p)) { toast("Bu buyum sotilgan"); return; }
  const f = state.cart.find((c) => c.key === item.key);
  f ? f.qty++ : state.cart.push({ ...item, qty: 1 });
  saveCart();
  toast(`${item.name} savatga qo'shildi`);
}
function changeQty(key, d) {
  const it = state.cart.find((c) => c.key === key);
  if (!it) return;
  it.qty += d;
  if (it.qty <= 0) state.cart = state.cart.filter((c) => c.key !== key);
  saveCart();
}
function saveCart() { safeSet("ag_cart2", JSON.stringify(state.cart)); renderCart(); }
function renderCart() {
  const count = state.cart.reduce((s, c) => s + c.qty, 0);
  $("#cartCount").textContent = count || "";
  $("#cartCount2").textContent = count || "";
  $("#sumCount").textContent = `${count} ta`;
  if (hasPrice()) {
    const total = state.cart.reduce((sum, c) => {
      const p = byId(c.id); if (!p) return sum;
      const vi = String(c.key).includes("|") ? +String(c.key).split("|")[1] : null;
      return sum + (estimate(p, vi) || 0) * c.qty;
    }, 0);
    $("#sumTotal").textContent = "≈ " + fmtMoney(total);
  } else $("#sumTotal").textContent = "Sotuvchi tasdiqlaydi";
  $("#cartList").innerHTML = state.cart.length
    ? state.cart.map((c) => `<div class="c-item">
        <img class="c-img" src="${byId(c.id)?.img || ""}" alt="">
        <div class="txt"><h4>${c.name}</h4><small>${c.meta}</small></div>
        <div class="qty">
          <button class="cbtn soft xs" data-qty="${c.key}" data-d="-1" aria-label="Kamaytirish">${icon("i-minus")}</button>${c.qty}
          <button class="cbtn dark xs" data-qty="${c.key}" data-d="1" aria-label="Ko'paytirish">${icon("i-plus")}</button>
        </div></div>`).join("")
    : `<p class="cart-empty">Savat hozircha bo'sh</p>`;
  const lines = state.cart.map((c, i) => `${i + 1}. ${c.name} — ${c.meta} — ${c.qty} ta`).join("\n");
  const ch = $("#checkout");
  ch.href = tgLink(`Assalomu alaykum! Saytdan buyurtma:\n${lines}\n\nNarxi va mavjudligini aytib bera olasizmi?`);
  ch.classList.toggle("disabled", !state.cart.length);
}
const openCart = () => document.body.classList.add("cart-open");
const closeCart = () => document.body.classList.remove("cart-open");

let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- kun mahsuloti ---------- */
let featV = 0;
function renderFeatured() {
  const p = FEATURED;
  if (!p) { document.querySelector(".featured").hidden = true; return; }
  $("#fImg").src = p.img;
  $("#fName").textContent = p.name;
  $("#fSizes").innerHTML = p.variants.map((v, i) => `<button class="${i === featV ? "active" : ""}" data-fv="${i}">${v[0]}</button>`).join("");
  $("#fWeight").textContent = p.variants[featV][1];
  const est = estimate(p, featV);
  $("#fPriceLabel").textContent = est ? "Taxminiy narx" : "Narxi kunlik kursga bog'liq";
  $("#fPrice").textContent = est ? fmtMoney(est) : "So'rov bo'yicha";
  $("#fOrder").href = tgLink(`Assalomu alaykum! ${p.name}, ${variantText(p, p.variants[featV])} haqida bilmoqchi edim. Narxi qancha?`);
}

/* ---------- hodisalar ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a, [data-open]");
  if (!t) return;
  if (t.dataset.cat) setCat(t.dataset.cat);
  if (t.dataset.filter) setCat(t.dataset.filter);
  if (t.dataset.fav) {
    const id = t.dataset.fav;
    state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
    safeSet("ag_favs", JSON.stringify([...state.favs]));
    t.classList.toggle("on");
    return;
  }
  if (t.dataset.add) {
    const p = byId(t.dataset.add);
    if (isSize(p) || p.vlabel === "Harf") { openModal(p.id); return; } // avval o'lcham/harf tanlansin
    addToCart({ key: `${p.id}`, id: p.id, name: p.name, meta: summary(p) });
    return;
  }
  if (t.dataset.thumb) { $("#mImg").src = t.dataset.thumb; return; }
  if (t.id === "more") { shown += PAGE; renderGrid(); return; }
  if (t.dataset.open) { openModal(t.dataset.open); return; }
  if (t.dataset.qty) changeQty(t.dataset.qty, +t.dataset.d);
  if (t.dataset.mv) { modalV = +t.dataset.mv; renderModal(); }
  if (t.dataset.fv) { featV = +t.dataset.fv; renderFeatured(); }
  if (t.hasAttribute("data-open-cart")) { closeModal(); openCart(); }
});

$("#fAdd").addEventListener("click", () => {
  const p = FEATURED;
  addToCart({ key: `${p.id}|${featV}`, id: p.id, name: p.name, meta: variantText(p, p.variants[featV]) });
});
$("#mAdd").addEventListener("click", addModalToCart);
$("#mClose").addEventListener("click", closeModal);
$("#mOverlay").addEventListener("click", closeModal);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); closeModal(); } });
$("#search").addEventListener("input", (e) => { state.query = e.target.value.trim(); renderGrid(); });

/* ---------- ishga tushirish ---------- */
renderFilters();
renderGrid();
renderCart();
renderFeatured();
