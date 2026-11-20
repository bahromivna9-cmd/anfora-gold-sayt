/* Rasmsiz (yashirin) mahsulotlarga rasmni Telegram'ning ochiq widget sahifasidan olish.
   https://t.me/<kanal>/<post>?embed=1 sahifasidagi rasm va video muqovalari yuklanadi.
   Ishga tushirish: node tools/backfill-embed.js   (GitHub Actions: "Rasmlarni to'ldirish")
   LIMIT=50 node tools/backfill-embed.js  — faqat 50 tasini sinab ko'rish */
const fs = require("fs");
const os = require("os");
const path = require("path");
const store = require("./store");

const CHANNEL = process.env.CHANNEL || "anfora_gold";
const LIMIT = Number(process.env.LIMIT) || Infinity;
const MAX_IMGS = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const UA = { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36" };

async function get(url, asBuffer) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (r.status === 429) { await sleep(5000 * (i + 1)); continue; }
      if (!r.ok) return null;
      return asBuffer ? Buffer.from(await r.arrayBuffer()) : await r.text();
    } catch { await sleep(2000); }
  }
  return null;
}

/* Widget HTML'dan media manzillari: video muqovasi va rasmlar ("blured" fon — faqat boshqasi bo'lmasa) */
function mediaUrls(html) {
  const sharp = [], blur = [];
  const re = /<(?:a|i|div)\b[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const cls = (tag.match(/class="([^"]*)"/) || [])[1] || "";
    if (!/photo_wrap|video_thumb/.test(cls)) continue;
    const u = tag.match(/background-image:url\('([^']+)'\)/);
    if (!u) continue;
    (/\bblured\b/.test(cls) ? blur : sharp).push(u[1].replace(/&amp;/g, "&"));
  }
  const list = sharp.length ? sharp : blur;
  return [...new Set(list)].slice(0, MAX_IMGS);
}

(async () => {
  const db = store.load();
  const todo = db.products.filter((p) => !p.img && !(p.imgs || []).length).slice(0, LIMIT);
  console.log(`Rasmsiz mahsulotlar: ${todo.length}`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "emb-"));
  let ok = 0, miss = 0;
  for (const [n, p] of todo.entries()) {
    const ids = p.msgs && p.msgs.length ? p.msgs : [p.id];
    let urls = [];
    for (const mid of ids) {
      const html = await get(`https://t.me/${CHANNEL}/${mid}?embed=1&mode=tme`);
      if (html) urls = mediaUrls(html);
      if (urls.length) break;
      await sleep(400);
    }
    const imgs = [];
    for (const [i, u] of urls.entries()) {
      const buf = await get(u, true);
      if (!buf || buf.length < 2000) continue;
      const src = path.join(tmp, `${p.id}-${i}.jpg`);
      fs.writeFileSync(src, buf);
      const out = store.makeImage(src, `${p.id}-${i + 1}.jpg`, false);
      if (out) imgs.push(out);
    }
    if (imgs.length) {
      p.img = imgs[0];
      p.imgs = imgs;
      delete p.hidden;
      ok++;
    } else miss++;
    if ((n + 1) % 25 === 0) { console.log(`${n + 1}/${todo.length}: +${ok}, topilmadi ${miss}`); store.save(db); }
    await sleep(350);
  }
  store.save(db);
  console.log(`Tayyor: ${ok} ta mahsulotga rasm qo'shildi, ${miss} tasida rasm topilmadi.`);
})();
