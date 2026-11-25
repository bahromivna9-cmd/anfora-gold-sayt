/* Telegram kanaldagi yangi postlarni botsiz olish (ochiq widget sahifalari orqali).
   https://t.me/<kanal>/<id>?embed=1 — oxirgi ma'lum postdan keyingilarni ketma-ket tekshiradi.
   Bot kanal admini bo'lmasa ham ishlaydi. Ishga tushirish: node tools/sync-web.js */
const fs = require("fs");
const os = require("os");
const path = require("path");
const store = require("./store");

const CHANNEL = process.env.CHANNEL || "anfora_gold";
const STATE_PATH = path.join(__dirname, "web-state.json");
const MISS_LIMIT = 25; // ketma-ket shuncha "topilmadi" bo'lsa — to'xtaydi
const MAX_SCAN = 300;
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

const decode = (s) => s
  .replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, "&").trim();

/* Widget sahifasini o'qish: matn, sana, albom a'zolari, media */
function parsePost(html, id) {
  if (!html || /tgme_widget_message_error/.test(html)) return null;
  const texts = [...html.matchAll(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => decode(m[1])).filter(Boolean);
  const date = (html.match(/<time[^>]*datetime="([^"]+)"/) || [])[1] || "";
  const re = new RegExp(`/${CHANNEL}/(\\d+)\\?single`, "gi");
  const members = [...new Set([...html.matchAll(re)].map((m) => +m[1]))];
  if (!members.includes(id)) members.push(id);
  const sharp = [], blur = [], videos = [];
  for (const v of html.matchAll(/<video\b[^>]*\ssrc="([^"]+)"/g)) videos.push(v[1].replace(/&amp;/g, "&"));
  for (const m of html.matchAll(/<(?:a|i|div)\b[^>]*>/g)) {
    const tag = m[0];
    const cls = (tag.match(/class="([^"]*)"/) || [])[1] || "";
    if (!/photo_wrap|video_thumb/.test(cls)) continue;
    const u = tag.match(/background-image:url\('([^']+)'\)/);
    if (u) (/\bblured\b/.test(cls) ? blur : sharp).push(u[1].replace(/&amp;/g, "&"));
  }
  return {
    caption: texts.length ? texts[texts.length - 1] : "",
    date: date.slice(0, 10),
    members: members.sort((a, b) => a - b),
    thumbs: [...new Set(sharp.length ? sharp : blur)].slice(0, MAX_IMGS),
    blurOnly: !sharp.length && !videos.length, // "Media is too big" — faqat xira fon bor
    videos: [...new Set(videos)].slice(0, MAX_IMGS),
  };
}

async function images(post, gid, tmp) {
  const imgs = [];
  if (store.HAS_FFMPEG) {
    for (const [i, u] of post.videos.entries()) {
      const buf = await get(u, true);
      if (!buf || buf.length < 10000) continue;
      const src = path.join(tmp, `${gid}-${i}.mp4`);
      fs.writeFileSync(src, buf);
      const out = store.makeImage(src, `${gid}-${i + 1}.jpg`, true);
      fs.rmSync(src, { force: true });
      if (out) imgs.push(out);
    }
  }
  if (!imgs.length && !post.blurOnly) {
    for (const [i, u] of post.thumbs.entries()) {
      const buf = await get(u, true);
      if (!buf || buf.length < 2000) continue;
      const src = path.join(tmp, `${gid}-${i}.jpg`);
      fs.writeFileSync(src, buf);
      const out = store.makeImage(src, `${gid}-${i + 1}.jpg`, false);
      if (out) imgs.push(out);
    }
  }
  return imgs;
}

(async () => {
  const db = store.load();
  const known = new Set();
  for (const p of db.products) for (const m of p.msgs && p.msgs.length ? p.msgs : [p.id]) known.add(m);
  const maxKnown = Math.max(0, ...known);
  const state = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) : {};
  let last = Math.max(maxKnown, state.last || 0);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "web-"));
  let misses = 0, added = 0;
  const DAY = 864e5, now = Date.now();
  state.pending = (state.pending || []).filter((x) => x.until > now);

  // Gramm yozilmagan postlarni 7 kun davomida qayta tekshirish (keyinroq matn qo'shilishi mumkin)
  async function handle(id, post) {
    post.members.forEach((m) => known.add(m));
    const gid = post.members[0];
    if (db.products.some((p) => p.id === gid)) return "bor";
    const p = store.toProduct({ id: gid, date: post.date, caption: post.caption, imgs: [], msgs: post.members });
    if (!p) return "matnsiz";
    const imgs = await images(post, gid, tmp);
    p.img = imgs[0] || ""; p.imgs = imgs;
    if (!imgs.length) p.hidden = true;
    store.upsert(db, p);
    added++;
    console.log(`+ ${p.name} (${gid}) ${imgs.length} rasm${post.blurOnly ? " — video juda katta, rasm yo'q (yashirin)" : ""}`);
    return "qo'shildi";
  }
  for (const x of [...state.pending]) {
    const post = parsePost(await get(`https://t.me/${CHANNEL}/${x.id}?embed=1&mode=tme`), x.id);
    await sleep(300);
    const r = post ? await handle(x.id, post) : "o'chirilgan";
    if (r !== "matnsiz") state.pending = state.pending.filter((y) => y.id !== x.id);
  }
  console.log(`Tekshiruv ${last + 1} dan boshlanadi (ffmpeg: ${store.HAS_FFMPEG ? "bor" : "yo'q"})`);

  for (let id = last + 1; id <= last + MAX_SCAN && misses < MISS_LIMIT; id++) {
    if (known.has(id)) { misses = 0; continue; }
    const post = parsePost(await get(`https://t.me/${CHANNEL}/${id}?embed=1&mode=tme`), id);
    await sleep(300);
    if (!post) { misses++; continue; }
    misses = 0;
    state.last = Math.max(state.last || 0, id);
    const r = await handle(id, post);
    if (r === "matnsiz") {
      const gid = post.members[0];
      if (!state.pending.some((x) => x.id === gid)) state.pending.push({ id: gid, until: now + 7 * DAY });
      console.log(`- ${gid}: gramm yozilmagan — 7 kun qayta tekshiriladi`);
    }
  }

  if (added) store.save(db);
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 1));
  console.log(`Tayyor: ${added} ta yangi mahsulot.`);
})().catch((e) => { console.error(e); process.exit(1); });
