/* =========================================================
   ESKI POSTLARNI IMPORT QILISH (bir marta)
   Telegram Desktop -> kanal -> ⋮ -> Export chat history
   (Photos + Videos, format: Machine-readable JSON)

   Ishlatish:  node tools/import-export.js "C:\Users\...\Downloads\Telegram Desktop\ChatExport_2026-11-19"
   ========================================================= */
const fs = require("fs");
const path = require("path");
const store = require("./store");

const dir = process.argv[2];
if (!dir || !fs.existsSync(path.join(dir, "result.json"))) {
  console.error("Eksport papkasini ko'rsating (ichida result.json bo'lishi kerak).");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path.join(dir, "result.json"), "utf8"));
const textOf = (m) => (Array.isArray(m.text) ? m.text.map((x) => (typeof x === "string" ? x : x.text || "")).join("") : m.text || "");
const exists = (rel) => rel && !/^\(File/.test(rel) && fs.existsSync(path.join(dir, rel)) ? path.join(dir, rel) : null;

// Albomlar: bir xil vaqtda (soniyagacha) yuborilgan ketma-ket media xabarlar
const msgs = data.messages.filter((m) => m.type === "message");
const groups = [];
for (const m of msgs) {
  const hasMedia = m.photo || m.file || m.thumbnail;
  const last = groups.at(-1);
  if (last && hasMedia && last.hasMedia && last.date === m.date) last.items.push(m);
  else groups.push({ date: m.date, hasMedia: !!hasMedia, items: [m] });
}

const db = store.load();
let added = 0, skipped = 0, noImage = 0;
for (const g of groups) {
  const caption = g.items.map(textOf).filter(Boolean).join("\n");
  const id = g.items[0].id;
  const imgs = [];
  g.items.slice(0, 4).forEach((m, n) => {
    const photo = exists(m.photo);
    const video = /video/.test(m.media_type || "") || /\.(mp4|mov)$/i.test(m.file || "") ? exists(m.file) : null;
    const thumb = exists(m.thumbnail);
    const out = `${id}-${n + 1}.jpg`;
    const img = photo ? store.makeImage(photo, out, false) : video ? store.makeImage(video, out, true) : thumb ? store.makeImage(thumb, out, false) : null;
    if (img) imgs.push(img);
  });
  const p = store.toProduct({ id, date: g.date.slice(0, 10), caption, imgs, msgs: g.items.map((m) => m.id) });
  if (!p) { skipped++; continue; }
  if (!imgs.length) noImage++;
  store.upsert(db, p);
  added++;
}
store.save(db);
console.log(`Tayyor: ${added} ta mahsulot qo'shildi/yangilandi, ${skipped} ta post mahsulot emas (e'lon va h.k.), ${noImage} tasida rasm yo'q.`);
