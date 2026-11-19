/* =========================================================
   Telegram Web orqali yig'ilgan kanal faylini import qilish
   (anfora-kanal.json: { posts: [{ id, date, text, imgs:[dataURL] }] })

   Ishlatish:  node tools/import-web.js anfora-kanal.json
   ========================================================= */
const fs = require("fs");
const path = require("path");
const store = require("./store");

const file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.error("anfora-kanal.json faylini ko'rsating"); process.exit(1); }
const { posts } = JSON.parse(fs.readFileSync(file, "utf8"));

fs.mkdirSync(store.IMG_DIR, { recursive: true });
const db = store.load();
let added = 0, skipped = 0, noImg = 0;
for (const p of posts) {
  const imgs = (p.imgs || []).map((d, n) => {
    const name = `${p.id}-${n + 1}.jpg`;
    fs.writeFileSync(path.join(store.IMG_DIR, name), Buffer.from(d.split(",")[1], "base64"));
    return `images/tg/${name}`;
  });
  const prod = store.toProduct({ id: p.id, date: p.date, caption: p.text || "", imgs, msgs: [p.id] });
  if (!prod) { skipped++; continue; }
  // Rasmsiz postlar saytda yashirin turadi (admin.html da ko'rsatish mumkin)
  if (!imgs.length) { prod.hidden = true; noImg++; }
  store.upsert(db, prod);
  added++;
}
store.save(db);
console.log(`Tayyor: ${added} ta mahsulot (${added - noImg} tasi rasmli, ${noImg} tasi rasmsiz — yashirin), ${skipped} ta post mahsulot emas.`);
