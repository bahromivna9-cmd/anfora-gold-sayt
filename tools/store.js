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

function save(db) {
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
function makeImage(input, outName, isVideo) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const out = path.join(IMG_DIR, outName);
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

module.exports = { load, save, makeImage, toProduct, upsert, IMG_DIR, ROOT };
