/* =========================================================
   YANGI POSTLARNI AVTOMATIK QO'SHISH (Telegram bot orqali)
   GitHub Actions har 15 daqiqada ishga tushiradi.

   Kerak: BOT_TOKEN (GitHub Secrets), bot kanalga admin qilib qo'shilgan.
   Ixtiyoriy: CHANNEL (default: anfora_gold)
   ========================================================= */
const fs = require("fs");
const os = require("os");
const path = require("path");
const store = require("./store");

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL = (process.env.CHANNEL || "anfora_gold").replace(/^@/, "").toLowerCase();
const STATE_PATH = path.join(__dirname, "state.json");
if (!TOKEN) { console.error("BOT_TOKEN topilmadi"); process.exit(1); }

const api = async (method, params = {}) => {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(params),
  });
  const j = await r.json();
  if (!j.ok) throw new Error(`${method}: ${j.description}`);
  return j.result;
};

async function download(fileId, ext) {
  const f = await api("getFile", { file_id: fileId }); // bot API: 20 MB gacha
  const r = await fetch(`https://api.telegram.org/file/bot${TOKEN}/${f.file_path}`);
  const tmp = path.join(os.tmpdir(), `tg-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
  fs.writeFileSync(tmp, Buffer.from(await r.arrayBuffer()));
  return tmp;
}

async function imageFor(post, outName) {
  try {
    if (post.photo) return store.makeImage(await download(post.photo.at(-1).file_id, "jpg"), outName, false);
    if (post.video) {
      if ((post.video.file_size || 0) <= 20e6) return store.makeImage(await download(post.video.file_id, "mp4"), outName, true);
      const th = post.video.thumbnail || post.video.thumb;
      if (th) return store.makeImage(await download(th.file_id, "jpg"), outName, false);
    }
  } catch (e) { console.warn("Rasm olinmadi:", e.message); }
  return null;
}

(async () => {
  const state = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) : { offset: 0, groups: {} };
  const updates = await api("getUpdates", { offset: state.offset, timeout: 0, allowed_updates: ["channel_post", "edited_channel_post"] });
  if (!updates.length) { console.log("Yangi post yo'q."); return; }

  const db = store.load();
  let changed = 0;
  for (const u of updates) {
    state.offset = u.update_id + 1;
    const post = u.channel_post || u.edited_channel_post;
    if (!post || (post.chat.username || "").toLowerCase() !== CHANNEL) continue;

    // Albom bo'lsa, hamma qismlar bitta mahsulotga yig'iladi
    const gkey = post.media_group_id || `m${post.message_id}`;
    // Eski postni tahrirlash: mavjud mahsulotni topamiz
    if (!state.groups[gkey] && u.edited_channel_post) {
      const old = db.products.find((p) => (p.msgs || [p.id]).includes(post.message_id));
      if (old) state.groups[gkey] = { id: old.id, date: old.date, texts: {}, imgs: Object.fromEntries((old.imgs || []).map((x, i) => [`old${i}`, x])), msgs: old.msgs || [old.id] };
    }
    const g = (state.groups[gkey] ||= { id: post.message_id, date: new Date(post.date * 1000).toISOString().slice(0, 10), texts: {}, imgs: {}, msgs: [] });
    if (!g.msgs.includes(post.message_id)) g.msgs.push(post.message_id);
    const text = post.caption || post.text || "";
    if (text) g.texts[post.message_id] = text;
    if (!g.imgs[post.message_id] && Object.keys(g.imgs).length < 4 && (post.photo || post.video)) {
      const img = await imageFor(post, `${g.id}-${post.message_id}.jpg`);
      if (img) g.imgs[post.message_id] = img;
    }
    const caption = Object.keys(g.texts).sort().map((k) => g.texts[k]).join("\n");
    const imgs = Object.keys(g.imgs).sort().map((k) => g.imgs[k]);
    const p = store.toProduct({ id: g.id, date: g.date, caption, imgs, msgs: g.msgs });
    if (p) { store.upsert(db, p); changed++; console.log(`+ ${p.name} (${p.id})`); }
  }
  // 3 kundan eski albom yozuvlarini tozalash
  const old = Date.now() - 3 * 864e5;
  for (const [k, g] of Object.entries(state.groups)) if (new Date(g.date).getTime() < old) delete state.groups[k];

  if (changed) store.save(db);
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 1));
  console.log(`Tayyor: ${changed} ta mahsulot yangilandi.`);
})().catch((e) => { console.error(e); process.exit(1); });
