/* =========================================================
   Telegram post matnini mahsulotga aylantirish.
   Misollar (kanaldagi haqiqiy yozuvlar):
     "17 razmer 2.24gr 18 razmer 2.32gr"      -> uzuk, o'lchamlar
     "19 razmer 1.89gr 3.14gr"                -> zirak to'plami (uzuk + sirg'a)
     "Zirek: 3.61gr 17 razmer 2.30gr"         -> zirak to'plami
     "Boyin 4.84gr Biraslet 2.40gr"           -> to'plam
     "11.46gr 55cm"                           -> zanjir
     "1) 3.98gr 19cm 2) 3.02gr 19 cm"         -> bilaguzuk
     "K harf 1.89gram"                        -> harfli kulon
   ========================================================= */

const NUM = String.raw`(\d+(?:[.,]\d+)?)`;
const fmt = (n) => (Math.round(n * 100) / 100).toFixed(2).replace(/0$/, "").replace(/\.0?$/, "").replace(".", ",");
const fmtW = (n) => fmt(n) + " g";
const fmtS = (n) => String(n).replace(",", ".");
const mergeSame = (vs) => vs.reduce((acc, v) => { const l = acc.at(-1); if (l && l[0] === v[0]) l[1] = l[1].replace(" g", "") + " / " + v[1]; else acc.push(v); return acc; }, []);

function normalize(raw) {
  let t = raw.split(/manzil\s*:|tel\s*:|telegram\s*:/i)[0];
  t = t.replace(/\d[\d.,]*\s*\$/g, " ")                       // "2.000$" narx
       .replace(/proba\s*:?\s*\d{3}|\d{3}\s*proba/gi, " ");      // proba raqami og'irlik emas
  // "Gram: 1.61 , 3.38 Razmer: 18" ko'rinishidagi tuzilgan post
  const gm = t.match(/gram\s*:\s*([\d.,\s]+)/i), rm = t.match(/razmer\s*:\s*(\d+(?:[.,]\d+)?)/i);
  if (gm && rm) {
    const ws = gm[1].split(/\s*,\s+|\s+/).filter((x) => /\d/.test(x));
    t = `${rm[1]} razmer ${ws.map((w) => w + "gr").join(" ")}`;
  }
  return t;
}

function tokenize(raw) {
  const t = normalize(raw)
    .replace(/[()]/g, " ")
    .replace(/\b\d\)\s*/g, " ; ") // "1) ... 2) ..." raqamlash
    .replace(/\s+/g, " ")
    .toLowerCase();
  const re = new RegExp(
    [
      `(?<size>${NUM})\\s*(?:razmer|размер|разм|r\\b)`,
      `(?<len>${NUM})\\s*(?:cm|sm|см)\\b`,
      `(?<w>${NUM})\\s*(?:gramm?|grsm|gr|g|грамм?|гр|г)(?![a-zа-я])`,
      `(?<letter>\\b[a-zа-я])\\s+harf`,
      `(?<lab>ziregi|zirek|zirak|zire\\b|boyn|зирек|сирга|sirg'?a|boʻyin|bo'yin|boyin|бойин|biraslet|braslet|bilaguzuk|браслет|kulon|кулон|uzuk|узук)`,
      `(?<sep>;)`,
    ].join("|"),
    "g"
  );
  const tokens = [];
  let m;
  while ((m = re.exec(t))) {
    const g = m.groups;
    if (g.size) tokens.push({ k: "size", v: parseFloat(g.size.replace(",", ".")) });
    else if (g.len) tokens.push({ k: "len", v: parseFloat(g.len.replace(",", ".")) });
    else if (g.w) tokens.push({ k: "w", v: parseFloat(g.w.replace(",", ".")) });
    else if (g.letter) tokens.push({ k: "letter", v: g.letter.toUpperCase() });
    else if (g.sep) tokens.push({ k: "sep" });
    else {
      const l = g.lab;
      const part = /zir|зир|сир|sirg/.test(l) ? "Zirak" : /bo.?yi?n|бойин/.test(l) ? "Bo'yin zanjir" : /b(i)?ras|bila|брас/.test(l) ? "Bilaguzuk" : /kulon|кулон/.test(l) ? "Kulon" : "Uzuk";
      tokens.push({ k: "lab", v: part });
    }
  }
  // og'irlik birligisiz yozilgan son: "10.46" (faqat bitta son bo'lsa)
  if (!tokens.some((x) => x.k === "w")) {
    const bare = t.match(/^\s*(\d{1,2}[.,]\d{1,2})\s*$/);
    if (bare) tokens.push({ k: "w", v: parseFloat(bare[1].replace(",", ".")) });
  }
  return tokens;
}

function notesFrom(raw) {
  const t = raw.toLowerCase();
  const notes = [];
  const p = t.match(/\b(585|750)\s*proba|proba\s*:?\s*(585|750)/);
  if (p) notes.push(`${p[1] || p[2]} proba`);
  if (/turkiya|turkey|турция/.test(t)) notes.push("Turkiya");
  if (/oq\s*tilla|oq\s*oltin|white/.test(t)) notes.push("Oq oltin");
  if (/biril|brill|бриллиант/.test(t)) notes.push("Brilliant");
  return notes.join(" · ");
}

function statusFrom(raw) {
  const t = (raw || "").toLowerCase();
  if (/sotildi|sotilgan|продано|продан\b/.test(t)) return "sotilgan";
  if (/holati\s*:\s*sotuvda|\bsotuvda\b|в наличии/.test(t)) return "sotuvda";
  if (/zakaz|buyurtma(ga| asosida)|под заказ/.test(t)) return "buyurtmaga";
  return "aniqlanmoqda";
}

function parseCaption(raw) {
  if (!raw || !raw.trim()) return null;
  const tokens = tokenize(raw);
  const weights = tokens.filter((x) => x.k === "w");
  if (!weights.length) return null; // e'lon, tabrik va h.k. — mahsulot emas

  const t = raw.toLowerCase();
  const note = notesFrom(raw);
  const sizes = tokens.filter((x) => x.k === "size");
  const lens = tokens.filter((x) => x.k === "len");
  const letters = tokens.filter((x) => x.k === "letter");
  const labs = tokens.filter((x) => x.k === "lab").map((x) => x.v);
  const has = (p) => labs.includes(p);

  // 1) Harfli kulon
  if (letters.length) {
    const variants = [];
    let cur = null;
    for (const x of tokens) {
      if (x.k === "letter") cur = x.v;
      else if (x.k === "w" && cur) { variants.push([cur, fmtW(x.v)]); cur = null; }
      else if (x.k === "w" && variants.length) { const v = variants.at(-1); v[1] = v[1].replace(" g", "") + " / " + fmtW(x.v); }
    }
    return { cat: "zanjir", name: "Harfli kulon", vlabel: "Harf", variants, note: note || "Ismingiz harfi bilan" };
  }

  // 2) Qismlar bilan yozilgan to'plam: Bo'yin / Biraslet / Kulon / Zirek / Uzuk
  const partLabels = labs.filter((l) => l !== "Uzuk" || !sizes.length);
  if (has("Bo'yin zanjir") || has("Bilaguzuk") || has("Kulon")) {
    let variants = [];
    let cur = null, curSize = null;
    const postfix = tokens[0] && tokens[0].k === "w" && tokens[1] && tokens[1].k === "lab";
    if (postfix) {
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].k === "w") { const nx = tokens[i + 1]; variants.push([nx && nx.k === "lab" ? nx.v : "Buyum", fmtW(tokens[i].v)]); }
      }
    }
    for (const x of postfix ? [] : tokens) {
      if (x.k === "lab") { cur = x.v; curSize = null; }
      else if (x.k === "size") { curSize = x.v; if (!cur || cur === "Zirak") cur = "Uzuk"; }
      else if (x.k === "w") {
        const name = cur === "Uzuk" && curSize ? `Uzuk, ${fmtS(curSize)} o'lcham` : cur || "Buyum";
        variants.push([name, fmtW(x.v)]);
      }
    }
    // bir qismning ketma-ket og'irliklari: "Boyin 2.23gr 2.09gr" -> "2,23 / 2,09 g"
    variants = variants.reduce((acc, v) => { const l = acc.at(-1); if (l && l[0] === v[0]) l[1] = l[1].replace(" g", "") + " / " + v[1]; else acc.push(v); return acc; }, []);
    const parts = new Set(variants.map((v) => v[0].split(",")[0]));
    let cat = "toplam", name = "Oltin to'plam";
    if (parts.size === 1 && parts.has("Bo'yin zanjir")) { cat = "zanjir"; name = "Oltin zanjir"; }
    else if (parts.size === 1 && parts.has("Bilaguzuk")) { cat = "bilaguzuk"; name = "Oltin bilaguzuk"; }
    else if ([...parts].every((p) => p === "Kulon" || p === "Bo'yin zanjir")) { cat = "zanjir"; name = "Kulonli marjon"; }
    return { cat, name, vlabel: variants.length > 1 ? "Tarkibi" : "Og'irligi", variants, note };
  }

  // 3) Uzunlik bilan: zanjir yoki bilaguzuk
  if (lens.length) {
    const variants = [];
    const lenFirst = tokens.findIndex((x) => x.k === "len") < tokens.findIndex((x) => x.k === "w");
    let pend = null;
    for (const x of tokens) {
      if (lenFirst) {
        if (x.k === "len") pend = x.v;
        else if (x.k === "w" && pend != null) { variants.push([`${fmtS(pend)} sm`, fmtW(x.v)]); pend = null; }
      } else {
        if (x.k === "w") pend = x.v;
        else if (x.k === "len" && pend != null) { variants.push([`${fmtS(x.v)} sm`, fmtW(pend)]); pend = null; }
      }
    }
    // uzunligi yozilmagan qolgan og'irliklar
    const usedW = variants.length;
    weights.slice(usedW).forEach((w, i) => variants.push([`${usedW + i + 1}-variant`, fmtW(w.v)]));
    const maxLen = Math.max(...lens.map((l) => l.v));
    const bracelet = maxLen <= 25 || /bras|bilaguzuk|браслет/.test(t);
    return { cat: bracelet ? "bilaguzuk" : "zanjir", name: bracelet ? "Oltin bilaguzuk" : "Oltin zanjir", vlabel: "Uzunlik", variants, note };
  }

  // 4) Zirak to'plami: "Zirek ..." yoki bitta o'lcham + ikkita og'irlik
  const isSet = has("Zirak") || (sizes.length === 1 && weights.length === 2);
  if (isSet && sizes.length) {
    const variants = [];
    let cur = null, curSize = null;
    for (const x of tokens) {
      if (x.k === "lab" && x.v === "Zirak") { cur = "Zirak"; }
      else if (x.k === "size") { cur = "Uzuk"; curSize = x.v; }
      else if (x.k === "w") {
        if (cur === "Zirak") { variants.push(["Zirak", fmtW(x.v)]); cur = null; }
        else if (cur === "Uzuk") { variants.push([`Uzuk, ${fmtS(curSize)} o'lcham`, fmtW(x.v)]); cur = "afterRing"; }
        else variants.push(["Zirak", fmtW(x.v)]); // o'lchamsiz qolgan og'irlik — sirg'a
      }
    }
    return { cat: "zirak", name: "Zirak to'plami", vlabel: "Tarkibi", variants: mergeSame(variants), note };
  }
  if (has("Zirak") && !sizes.length && weights.length === 2) {
    return { cat: "zirak", name: "Zirak to'plami", vlabel: "Tarkibi", variants: [["Zirak", fmtW(weights[0].v)], ["Uzuk", fmtW(weights[1].v)]], note };
  }
  if (has("Zirak") && !sizes.length) {
    return { cat: "zirak", name: "Sirg'a", vlabel: "Og'irligi", variants: weights.map((w, i) => [weights.length > 1 ? `${i + 1}-variant` : "Sirg'a", fmtW(w.v)]), note };
  }

  // 5) Uzuk: o'lcham + og'irlik(lar)
  if (sizes.length) {
    const map = new Map();
    let cur = sizes.length === 1 ? sizes[0].v : null;
    for (const x of tokens) {
      if (x.k === "size") cur = x.v;
      else if (x.k === "w" && cur != null) {
        if (!map.has(cur)) map.set(cur, []);
        map.get(cur).push(x.v);
      }
    }
    const variants = [...map.entries()].sort((a, b) => a[0] - b[0]).map(([s, ws]) => [fmtS(s), ws.map(fmt).join(" / ") + " g"]);
    if (!variants.length) return null;
    const brill = /biril|brill/.test(t);
    return { cat: "uzuk", name: brill ? "Brilliantli uzuk" : /oq\s*tilla/.test(t) ? "Oq oltin uzuk" : "Tilla uzuk", vlabel: "O'lcham", variants, note };
  }

  // 6) Faqat og'irlik — turi noma'lum (admin.html da kategoriyani tanlash mumkin)
  const zanjirHint = /zanjir|цепь|boyin|bo'yin/.test(t), brasHint = /bras|bilaguzuk|браслет/.test(t);
  const cat = zanjirHint ? "zanjir" : brasHint ? "bilaguzuk" : "boshqa";
  const name = zanjirHint ? "Oltin zanjir" : brasHint ? "Oltin bilaguzuk" : "Oltin buyum";
  return {
    cat, name, vlabel: "Og'irligi",
    variants: weights.map((w, i) => [weights.length > 1 ? `${i + 1}-variant` : "Og'irligi", fmtW(w.v)]),
    note,
  };
}

module.exports = { parseCaption, tokenize, statusFrom };
