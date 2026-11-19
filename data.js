/* =========================================================
   ANFORA GOLD — MA'LUMOTLAR FAYLI
   Saytdagi barcha ma'lumot shu yerda. Uni qo'lda yoki
   admin.html sahifasi orqali tahrirlash mumkin.
   ========================================================= */

// Kunlik narx. 1 gramm narxini yozsangiz, saytda taxminiy narx
// avtomatik hisoblanadi. Bo'sh qoldirilsa (null), narx ko'rsatilmaydi.
const SETTINGS = {
  pricePerGram: null,      // masalan: 1250000  (so'mda)
  priceDate: "",           // masalan: "2026-11-16"
};

// Mahsulot holati (status):
//   "sotuvda"       — bor, sotuvda
//   "aniqlanmoqda"  — kanalga joylangan, mavjudligini so'rash kerak
//   "buyurtmaga"    — buyurtma asosida tayyorlanadi
//   "sotilgan"      — sotilgan (saytda kulrang ko'rinadi)
// date — Telegram kanalga joylangan sana

const CONTACT = {
  telegram: "Muhabbat_goold",
  phone: "+998935891412",
};

const CATEGORIES = [
  { id: "all", name: "Hammasi", icon: "i-ring" },
  { id: "uzuk", name: "Uzuklar", icon: "i-ring" },
  { id: "zirak", name: "Zirak to'plamlari", icon: "i-ring" },
  { id: "zanjir", name: "Zanjir va marjonlar", icon: "i-chain" },
  { id: "bilaguzuk", name: "Bilaguzuklar", icon: "i-bracelet" },
  { id: "toplam", name: "To'liq to'plamlar", icon: "i-chain" },
  { id: "boshqa", name: "Boshqa buyumlar", icon: "i-ring" },
];

// Qo'lda qo'shilgan mahsulotlar (Telegram'dan avtomatik kelganlari products.js da)
const MANUAL_PRODUCTS = [];

// Admin o'zgartirishlari (mahsulot id si bo'yicha): nom, holat, kategoriya, izoh, yashirish
// Masalan: OVERRIDES = { 412: { name: "Gulli uzuk", status: "sotuvda" }, 415: { hidden: true } };
const OVERRIDES = {
 "3448": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "3451": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "3454": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "3483": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3486": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3488": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3490": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "3588": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3591": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3594": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3627": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3693": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3695": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3697": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3703": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3757": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3829": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3859": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3861": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3964": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3966": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4115": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4185": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4526": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4529": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4532": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4534": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4862": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4927": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4960": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "4962": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "5040": {
  "name": "Oq oltin uzuk",
  "hidden": false,
  "img": "images/uzuk-oq-oltin.jpg",
  "imgs": [
   "images/uzuk-oq-oltin.jpg"
  ],
  "note": "Oq oltin"
 },
 "5128": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "5152": {
  "name": "To'liq to'plam",
  "hidden": false,
  "img": "images/toplam-toliq.jpg",
  "imgs": [
   "images/toplam-toliq.jpg"
  ]
 },
 "5158": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "5281": {
  "name": "Tangachali to'plam",
  "hidden": false,
  "img": "images/toplam-tangachali.jpg",
  "imgs": [
   "images/toplam-tangachali.jpg"
  ]
 },
 "5421": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5423": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5425": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5427": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5429": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5513": {
  "name": "Keng bilaguzuk",
  "hidden": false,
  "img": "images/bilaguzuk-keng.jpg",
  "imgs": [
   "images/bilaguzuk-keng.jpg"
  ]
 },
 "5515": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "5517": {
  "name": "Naqshli bilaguzuk",
  "hidden": false,
  "img": "images/bilaguzuk-naqshli.jpg",
  "imgs": [
   "images/bilaguzuk-naqshli.jpg"
  ]
 },
 "5523": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "5555": {
  "cat": "zanjir",
  "name": "Uzun turk zanjiri"
 },
 "5557": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5559": {
  "name": "Turk zanjiri",
  "hidden": false,
  "img": "images/zanjir-turk.jpg",
  "imgs": [
   "images/zanjir-turk.jpg"
  ],
  "note": "585 proba · Turkiya"
 },
 "5561": {
  "cat": "zanjir",
  "name": "Osma bezakli zanjir"
 },
 "5564": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "5566": {
  "name": "Yangi model uzuk"
 },
 "5615": {
  "name": "Gulli toshli uzuk"
 },
 "5619": {
  "name": "Gulli zirak to'plami"
 },
 "5623": {
  "name": "Klassik zirak to'plami"
 },
 "5655": {
  "name": "Yengil gulli to'plam"
 },
 "5789": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5792": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5815": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "5819": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "5823": {
  "cat": "zanjir",
  "name": "Ingichka zanjir"
 },
 "5825": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5827": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5829": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5831": {
  "name": "Yurak kulonli zanjir",
  "hidden": false,
  "img": "images/zanjir-yurak-kulonli.jpg",
  "imgs": [
   "images/zanjir-yurak-kulonli.jpg"
  ]
 },
 "5833": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5835": {
  "cat": "zanjir",
  "name": "Ilon zanjir"
 },
 "5837": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5839": {
  "name": "Doira kulonli marjon"
 },
 "6036": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6038": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6040": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6042": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6050": {
  "name": "Oq oltin bilaguzuk",
  "hidden": false,
  "img": "images/bilaguzuk-oq-oltin.jpg",
  "imgs": [
   "images/bilaguzuk-oq-oltin.jpg"
  ],
  "note": "Oq oltin"
 },
 "6052": {
  "name": "Silliq tilla uzuk",
  "hidden": false,
  "img": "images/uzuk-silliq.jpg",
  "imgs": [
   "images/uzuk-silliq.jpg"
  ]
 },
 "6103": {
  "name": "Kichik zirak to'plami"
 },
 "6160": {
  "name": "Nafis uzuk va zirak",
  "note": "585 proba"
 },
 "6174": {
  "name": "Toshli zirak to'plami"
 },
 "6191": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "6203": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6207": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6214": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6218": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6222": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6226": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6230": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6242": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "6244": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "6248": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "6250": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "6254": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "6342": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6346": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6350": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 }
};

// "Kun mahsuloti" (bo'sh bo'lsa — avtomatik tanlanadi)
const FEATURED_ID = "";
