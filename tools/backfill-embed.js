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
  const sharp = [], blur = [], videos = [];
  for (const v of html.matchAll(/<video\b[^>]*\ssrc="([^"]+)"/g)) videos.push(v[1].replace(/&amp;/g, "&"));
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
  return { thumbs: [...new Set(list)].slice(0, MAX_IMGS), videos: [...new Set(videos)].slice(0, MAX_IMGS) };
}

/* Video muqovasi kichik (180x320). ffmpeg bo'lsa — videodan katta kadr olinadi. */
const imgPath = (rel) => path.join(store.ROOT, rel);
const isSmall = (p) => (p.imgs && p.imgs.length ? p.imgs : [p.img]).some((rel) => {
  try { return /images\/tg\//.test(rel) && fs.statSync(imgPath(rel)).size < 20000; } catch { return false; }
});

(async () => {
  const db = store.load();
  const todo = db.products.filter((p) => (!p.img && !(p.imgs || []).length) || (store.HAS_FFMPEG && isSmall(p))).slice(0, LIMIT);
  console.log(`Ishlanadigan mahsulotlar: ${todo.length} (ffmpeg: ${store.HAS_FFMPEG ? "bor" : "yo'q"})`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "emb-"));
  let ok = 0, miss = 0;
  for (const [n, p] of todo.entries()) {
    const ids = p.msgs && p.msgs.length ? p.msgs : [p.id];
    let media = { thumbs: [], videos: [] };
    for (const mid of ids) {
      const html = await get(`https://t.me/${CHANNEL}/${mid}?embed=1&mode=tme`);
      if (html) media = mediaUrls(html);
      if (media.thumbs.length || media.videos.length) break;
      await sleep(400);
    }
    const imgs = [];
    // 1) videodan katta kadr (ffmpeg bo'lsa)
    if (store.HAS_FFMPEG) {
      for (const [i, u] of media.videos.entries()) {
        const buf = await get(u, true);
        if (!buf || buf.length < 10000) continue;
        const src = path.join(tmp, `${p.id}-${i}.mp4`);
        fs.writeFileSync(src, buf);
        const out = store.makeImage(src, `${p.id}-${i + 1}.jpg`, true);
        fs.rmSync(src, { force: true });
        if (out) imgs.push(out);
      }
    }
    // 2) bo'lmasa — rasm yoki video muqovasi
    if (!imgs.length) {
      for (const [i, u] of media.thumbs.entries()) {
        const buf = await get(u, true);
        if (!buf || buf.length < 2000) continue;
        const src = path.join(tmp, `${p.id}-${i}.jpg`);
        fs.writeFileSync(src, buf);
        const out = store.makeImage(src, `${p.id}-${i + 1}.jpg`, false);
        if (out) imgs.push(out);
      }
    }
    if (imgs.length) {
      for (const old of p.imgs || []) if (!imgs.includes(old) && /images\/tg\//.test(old)) fs.rmSync(imgPath(old), { force: true });
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
