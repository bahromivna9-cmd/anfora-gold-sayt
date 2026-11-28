/* Mahsulotlar bazasi: tools/products.json (asosiy) -> products.js (sayt uchun) */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { parseCaption, statusFrom } = require("./parse");

const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(__dirname, "products.json");
const JS_PATH = path.join(ROOT, "products.js");
const IMG_DIR = path.join(ROOT, "images", "tg");

function load() {
  if (!fs.existsSync(JSON_PATH)) return { updated: null, products: [] };
  return JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
}


/* Rasm o'lchami (JPEG/PNG sarlavhasidan, kutubxonasiz) */
function imgSize(rel) {
  try {
    const b = fs.readFileSync(path.join(ROOT, rel));
    if (b[0] === 0x89 && b[1] === 0x50) return [b.readUInt32BE(16), b.readUInt32BE(20)];
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch {}
  return [0, 0];
}

/* Sifat: eng aniq rasm birinchi; xira (kichik) rasmlilar lq=true — saytda oxirida chiqadi.
   O'zgarish bo'lsa true qaytaradi. */
const LQ_MIN = 400;
function refreshQuality(db) {
  let changed = false;
  for (const p of db.products) {
    const imgs = p.imgs && p.imgs.length ? p.imgs : p.img ? [p.img] : [];
    const q = (r) => Math.min(...imgSize(r));
    const sorted = imgs.map((r, i) => [r, q(r), i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]);
    const best = sorted.length ? sorted[0][1] : 0;
    const lq = !sorted.length || best < LQ_MIN;
    const order = sorted.map((x) => x[0]);
    if (order.length && (JSON.stringify(order) !== JSON.stringify(p.imgs || []) || p.img !== order[0])) { p.imgs = order; p.img = order[0]; changed = true; }
    if (!!p.lq !== lq) { if (lq) p.lq = true; else delete p.lq; changed = true; }
  }
  return changed;
}

function save(db) {
  refreshQuality(db);
  db.products.sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.id - a.id);
  db.updated = new Date().toISOString();
  fs.writeFileSync(JSON_PATH, JSON.stringify(db, null, 1));
  const site = db.products.map(({ caption, msgs, ...p }) => p); // saytga xom matn kerak emas
  fs.writeFileSync(
    JS_PATH,
    `/* AVTOMATIK YARATILADI — qo'lda tahrirlamang (tools/ skriptlari yangilaydi).\n   O'zgartirish uchun admin.html yoki data.js dagi OVERRIDES dan foydalaning. */\n` +
      `const AUTO = ${JSON.stringify({ updated: db.updated, count: site.length, products: site })};\n`
  );
}

/* Rasmni saytga moslash: eni 900px, JPEG. Video bo'lsa — 1-soniyadagi kadr. */
const HAS_FFMPEG = spawnSync("ffmpeg", ["-version"]).status === 0;

function makeImage(input, outName, isVideo) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const out = path.join(IMG_DIR, outName);
  if (!HAS_FFMPEG) {
    // ffmpeg yo'q: rasm shundayicha saqlanadi, video o'tkazib yuboriladi
    if (isVideo) return null;
    fs.copyFileSync(input, out);
    return `images/tg/${outName}`;
  }
  const args = ["-y", "-loglevel", "error"];
  if (isVideo) args.push("-ss", "1");
  args.push("-i", input, "-frames:v", "1", "-vf", "scale='min(900,iw)':-2", "-q:v", "4", out);
  let r = spawnSync("ffmpeg", args);
  if (r.status !== 0 && isVideo) {
    // juda qisqa video: boshidan olamiz
    r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", input, "-frames:v", "1", "-vf", "scale='min(900,iw)':-2", "-q:v", "4", out]);
  }
  return r.status === 0 && fs.existsSync(out) ? `images/tg/${outName}` : null;
}

/* Bitta post (yoki albom) -> mahsulot. null — mahsulot emas. */
function toProduct({ id, date, caption, imgs, msgs }) {
  const parsed = parseCaption(caption);
  if (!parsed || !parsed.variants.length) return null;
  return {
    id,
    date,
    status: statusFrom(caption),
    ...parsed,
    img: imgs[0] || "",
    imgs,
    caption: caption.trim(),
    msgs,
  };
}

function upsert(db, product) {
  const i = db.products.findIndex((p) => p.id === product.id);
  if (i >= 0) db.products[i] = { ...db.products[i], ...product };
  else db.products.push(product);
}

module.exports = { refreshQuality, load, save, makeImage, toProduct, upsert, IMG_DIR, ROOT, HAS_FFMPEG };
