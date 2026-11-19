# Anfora Gold — katalog sayti

Telegram kanal (@anfora_gold) postlari saytga **avtomatik** tushadi:
eski postlar bir marta import qilinadi, yangilari har 15 daqiqada bot orqali qo'shiladi.

## Fayllar
- `index.html` — sayt
- `admin.html` — boshqaruv: nom, holat, kategoriya, yashirish, kunlik narx (kod yozmasdan)
- `products.js` — Telegram'dan **avtomatik** yaratiladi (qo'lda tahrirlamang)
- `data.js` — qo'lda sozlamalar: narx, aloqa, admin o'zgartirishlari (`OVERRIDES`), qo'lda qo'shilgan mahsulotlar
- `script.js`, `style.css` — sayt mantiqi va dizayni
- `tools/` — avtomatlashtirish skriptlari
  - `parse.js` — post matnini ("17 razmer 2.24gr", "Zirek 3.61gr" ...) mahsulotga aylantiradi
  - `import-export.js` — eski postlarni Telegram Desktop eksportidan import qilish
  - `sync-bot.js` — yangi postlarni bot orqali olish
- `.github/workflows/telegram-sync.yml` — GitHub'da har 15 daqiqada `sync-bot.js` ni ishga tushiradi

## Post qanday tushuniladi
| Post matni | Saytda |
|---|---|
| `17 razmer 2.24gr 18 razmer 2.32gr` | Tilla uzuk, o'lchamlar bilan |
| `19 razmer 1.89gr 3.14gr` yoki `Zirek 3.61gr 17 razmer 2.30gr` | Zirak to'plami (uzuk + sirg'a) |
| `Boyin 4.84gr Biraslet 2.40gr` | To'plam |
| `Kulon 2.36gr Boyin 2.23gr` | Kulonli marjon |
| `11.46gr 55cm` | Zanjir · `3.98gr 19cm` — Bilaguzuk |
| `K harf 1.89gram` | Harfli kulon |
| `585 proba`, `Turkiya`, `Oq tilla` | Kartada izoh sifatida |
| `sotildi` / `sotuvda` | Holat avtomatik qo'yiladi |
| Og'irligi yo'q post (e'lon, tabrik) | Saytga qo'shilmaydi |

Turi aniqlanmagan buyum "Boshqa buyumlar"ga tushadi — admin.html da kategoriyasini tanlash mumkin.
**Maslahat:** postga turini qo'shib yozing ("Uzuk 18 razmer 2.1gr", "Zanjir 5.8gr 50cm") — sayt aniqroq ajratadi.

## Avtomatik yangilanishni yoqish (bir marta)
1. **Bot:** Telegram'da @BotFather → `/newbot` → bot nomini kiriting → **token**ni nusxalang.
2. Botni **@anfora_gold kanaliga admin** qilib qo'shing (kanal → Administratorlar → Admin qo'shish).
3. **GitHub:** yangi ochiq (Public) repozitoriy yarating, masalan `anfora-gold`, va shu papkadagi hamma fayllarni yuklang.
4. Repozitoriy → **Settings → Secrets and variables → Actions → New repository secret**: nomi `BOT_TOKEN`, qiymati — bot tokeni.
5. **Settings → Pages**: Source — `Deploy from a branch`, Branch — `main`, `/ (root)` → Save. Sayt manzili: `https://<login>.github.io/anfora-gold/`
6. **Actions** bo'limi → "Telegram -> sayt" → **Run workflow** (birinchi sinov).

Shundan keyin kanalga qo'yilgan har bir yangi post 15–20 daqiqada saytda paydo bo'ladi.

## Boshqaruv (admin.html)
1. `admin.html` ni oching (internetdagi saytda: `.../admin.html`).
2. Nom, holat, kategoriyani o'zgartiring, keraksiz postni "Saytda ko'rsatmaslik" qiling, kunlik 1 gramm narxini yozing.
3. **"data.js ni yuklab olish"** → GitHub'da eski `data.js` o'rniga yuklang (Add file → Upload files).

## Eski postlarni qayta import qilish
Telegram Web orqali yig'ilgan fayldan:
```
node tools/import-web.js anfora-kanal.json
```
Yoki Telegram Desktop eksportidan:
```
node tools/import-export.js "C:\Users\...\Downloads\Telegram Desktop\ChatExport_..."
```
(Node.js va ffmpeg kerak.)

## Cheklovlar
- Bot faqat u qo'shilgandan **keyingi** postlarni ko'radi (eskilari — import orqali).
- Kanaldan o'chirilgan post saytdan o'zi o'chmaydi — admin.html da yashiring.
- 20 MB dan katta videoning rasmi kichik (Telegram'ning muqova rasmi) bo'ladi.
- GitHub uzoq vaqt (60 kun) faollik bo'lmasa, avtomatik ishni to'xtatadi — Actions'da qayta yoqiladi.
