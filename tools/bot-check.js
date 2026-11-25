/* Bot tekshiruvi: kalit qaysi botniki, kanalda adminmi, webhook bormi. Kalitning o'zi chiqarilmaydi. */
const TOKEN = process.env.BOT_TOKEN;
const CHANNEL = "@" + (process.env.CHANNEL || "anfora_gold").replace(/^@/, "");
if (!TOKEN) { console.log("❌ BOT_TOKEN GitHub Secrets'da yo'q"); process.exit(0); }
const api = async (m, p = {}) => {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${m}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(p) });
  return r.json();
};
(async () => {
  const me = await api("getMe");
  if (!me.ok) { console.log("❌ Kalit noto'g'ri yoki bekor qilingan:", me.description); return; }
  console.log(`✅ Bot: @${me.result.username} (${me.result.first_name}), id ${me.result.id}`);
  const wh = await api("getWebhookInfo");
  if (wh.ok && wh.result.url) console.log(`⚠️ Webhook o'rnatilgan: ${new URL(wh.result.url).host} — postlar o'sha xizmatga ketadi, getUpdates bo'sh qaytadi`);
  else console.log("✅ Webhook yo'q");
  if (wh.ok) console.log(`   Kutilayotgan yangilanishlar: ${wh.result.pending_update_count}`);
  const chat = await api("getChat", { chat_id: CHANNEL });
  console.log(chat.ok ? `✅ Kanal: ${chat.result.title} (${chat.result.type}), id ${chat.result.id}` : `❌ Kanal topilmadi: ${chat.description}`);
  const mem = await api("getChatMember", { chat_id: CHANNEL, user_id: me.result.id });
  if (mem.ok) console.log(`${mem.result.status === "administrator" ? "✅" : "❌"} Botning kanaldagi holati: ${mem.result.status}`);
  else console.log(`❌ Bot kanal a'zosi emas: ${mem.description}`);
})();
