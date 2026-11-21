/* =========================================================
   ANFORA GOLD — MA'LUMOTLAR FAYLI
   Saytdagi barcha ma'lumot shu yerda. Uni qo'lda yoki
   admin.html sahifasi orqali tahrirlash mumkin.
   ========================================================= */

// Kunlik narx. 1 gramm narxini yozsangiz, saytda taxminiy narx
// avtomatik hisoblanadi. Bo'sh qoldirilsa (null), narx ko'rsatilmaydi.
// Versiya belgisi — admin panel eski qoralamani aniqlashi uchun
const DATA_STAMP = "2026-11-21T07:00:00Z";

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
 "2716": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "2736": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "2887": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "2965": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3369": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3439": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3442": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3445": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
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
 "3457": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3460": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3463": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3466": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3469": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3472": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3475": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3478": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3480": {
  "cat": "zirak",
  "name": "Zirak to'plami"
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
 "3492": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3498": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3503": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3545": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3547": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3549": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3551": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3553": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3561": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3563": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3565": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
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
 "3598": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3600": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3602": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3604": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3608": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3610": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3620": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3627": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3631": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3646": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3655": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3665": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3679": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
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
 "3699": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3701": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3703": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3709": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3715": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3717": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3743": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3745": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3747": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3749": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3751": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3753": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3755": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "3757": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3769": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3772": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3774": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3776": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3778": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3780": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3782": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3784": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3786": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3788": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3790": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3798": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3800": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3802": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "3823": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3826": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3829": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3849": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3851": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3853": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3855": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3857": {
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
 "3868": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3871": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3873": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3875": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3877": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3879": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3964": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3966": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3968": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3970": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3972": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3974": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "3978": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "3982": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4057": {
  "cat": "toplam",
  "name": "Oltin to'plam"
 },
 "4069": {
  "cat": "toplam",
  "name": "Oltin to'plam"
 },
 "4109": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4111": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4115": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4169": {
  "cat": "boshqa",
  "name": "Oltin kulon"
 },
 "4171": {
  "cat": "boshqa",
  "name": "Oltin kulon"
 },
 "4185": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4193": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4258": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4260": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4262": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4264": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4270": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "4275": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4278": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4444": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4446": {
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
 "4536": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4538": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4540": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4542": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4544": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4546": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4548": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4817": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4819": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4828": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4832": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4843": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4862": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4911": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4919": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4927": {
  "cat": "zanjir",
  "name": "Kulonli marjon"
 },
 "4931": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4960": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "4962": {
  "cat": "zirak",
  "name": "Sirg'a"
 },
 "4964": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4966": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4968": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4970": {
  "cat": "zirak",
  "name": "Zirak to'plami"
 },
 "4973": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "4975": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "4978": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
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
 "5149": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
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
 "5222": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5281": {
  "name": "Tangachali to'plam",
  "hidden": false,
  "img": "images/toplam-tangachali.jpg",
  "imgs": [
   "images/toplam-tangachali.jpg"
  ]
 },
 "5369": {
  "cat": "boshqa",
  "name": "Oltin kulon"
 },
 "5371": {
  "cat": "boshqa",
  "name": "Oltin kulon"
 },
 "5373": {
  "cat": "boshqa",
  "name": "Oltin kulon"
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
 "5509": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5511": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "5513": {
  "name": "Keng bilaguzuk",
  "hidden": false,
  "img": "images/bilaguzuk-keng.jpg",
  "imgs": [
   "images/bilaguzuk-keng.jpg"
  ],
  "cat": "bilaguzuk"
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
  ],
  "cat": "bilaguzuk"
 },
 "5519": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "5521": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
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
  "note": "585 proba · Turkiya",
  "cat": "zanjir"
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
 "5734": {
  "cat": "toplam",
  "name": "Oltin to'plam"
 },
 "5746": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "5750": {
  "cat": "zirak",
  "name": "Zirak to'plami"
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
  ],
  "cat": "zanjir"
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
 "5843": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "5845": {
  "cat": "uzuk",
  "name": "Tilla uzuk"
 },
 "5945": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6028": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6030": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6032": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6034": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
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
 "6044": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6046": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 },
 "6048": {
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
  "note": "Oq oltin",
  "cat": "bilaguzuk"
 },
 "6052": {
  "name": "Silliq tilla uzuk",
  "hidden": false,
  "img": "images/uzuk-silliq.jpg",
  "imgs": [
   "images/uzuk-silliq.jpg"
  ]
 },
 "6091": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
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
 },
 "6355": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "6357": {
  "cat": "zanjir",
  "name": "Oltin zanjir"
 },
 "6359": {
  "cat": "bilaguzuk",
  "name": "Oltin bilaguzuk"
 }
};

// "Kun mahsuloti" (bo'sh bo'lsa — avtomatik tanlanadi)
const FEATURED_ID = "";
