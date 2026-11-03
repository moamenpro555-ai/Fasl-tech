/* ===================== FASL TECH · النواة المشتركة ===================== */
(function (g) {
  "use strict";
  const FT = g.FT = { modules: [], cfg: Object.assign({ id: "app", name: "FASL TECH", tagline: "", modules: [], runnerBase: "" }, g.FT_PRODUCT || {}) };

  /* ---------- أدوات صغيرة ---------- */
  FT.$ = (s, r) => (r || document).querySelector(s);
  FT.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  FT.esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  FT.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  FT.num = v => { v = parseFloat(String(v).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(",", ".")); return isNaN(v) ? 0 : v; };
  FT.round = (v, d = 1) => { const p = Math.pow(10, d); return Math.round((v + Number.EPSILON) * p) / p; };
  FT.fmt = (n, d = 0) => (Number(n) || 0).toLocaleString("en-US", { maximumFractionDigits: d });
  FT.money = n => FT.fmt(n, 2).replace(/\.00$/, "") + " " + (FT.db ? FT.db.meta.currency : "ج.م");
  FT.pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;
  FT.sum = a => a.reduce((s, x) => s + (Number(x) || 0), 0);
  FT.avg = a => a.length ? FT.sum(a) / a.length : 0;
  FT.group = (arr, fn) => arr.reduce((m, x) => { const k = fn(x); (m[k] = m[k] || []).push(x); return m; }, {});
  FT.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  FT.debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  FT.toEn = s => String(s || "").replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  FT.COLORS = ["#2f66dc", "#14966a", "#d98b0b", "#c2410c", "#7c3aed", "#0e8aa6", "#b4237a", "#5a6b2d"];
  FT.colorOf = s => { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return FT.COLORS[Math.abs(h) % FT.COLORS.length]; };
  FT.initial = n => (String(n || "?").trim()[0] || "?");
  FT.avatar = (n, cls = "") => `<span class="avatar ${cls}" style="background:${FT.colorOf(n)}">${FT.esc(FT.initial(n))}</span>`;

  /* ---------- التاريخ (توقيت مصر، أرقام لاتينية، الأسبوع يبدأ السبت) ---------- */
  const D = FT.date = {};
  D.pad = n => String(n).padStart(2, "0");
  D.iso = d => { d = d || new Date(); return d.getFullYear() + "-" + D.pad(d.getMonth() + 1) + "-" + D.pad(d.getDate()); };
  D.today = () => D.iso(new Date());
  D.parse = s => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); };
  D.add = (s, n) => { const d = D.parse(s); d.setDate(d.getDate() + n); return D.iso(d); };
  D.addMonths = (s, n) => { const d = D.parse(s); d.setMonth(d.getMonth() + n); return D.iso(d); };
  D.days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  D.months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  D.dow = s => D.parse(s).getDay();
  D.dayName = s => D.days[D.dow(s)];
  D.weekStart = s => { const d = D.parse(s); const k = (d.getDay() + 1) % 7; d.setDate(d.getDate() - k); return D.iso(d); }; // السبت
  D.fmt = s => { if (!s) return "—"; const d = D.parse(s); return d.getDate() + " " + D.months[d.getMonth()] + " " + d.getFullYear(); };
  D.short = s => { if (!s) return "—"; const d = D.parse(s); return d.getDate() + " " + D.months[d.getMonth()]; };
  D.ym = s => String(s).slice(0, 7);
  D.ymLabel = ym => { const [y, m] = ym.split("-").map(Number); return D.months[m - 1] + " " + y; };
  D.diff = (a, b) => Math.round((D.parse(a) - D.parse(b)) / 864e5);
  D.time12 = t => { if (!t) return ""; let [h, m] = t.split(":").map(Number); const ap = h >= 12 ? "م" : "ص"; h = h % 12 || 12; return h + ":" + D.pad(m) + " " + ap; };

  /* ---------- أيقونات ---------- */
  const P = {
    home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
    users: "M16 19v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 19v-1a4 4 0 00-3-3.9M16 3.1a3.5 3.5 0 010 6.8",
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1",
    check: "M5 12.5l4.5 4.5L19 7.5",
    x: "M6 6l12 12M18 6L6 18",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    edit: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
    trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    search: "M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5",
    calendar: "M4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7zM4 10h16M8 3v4M16 3v4",
    clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
    book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13",
    cash: "M3 7h18v10H3zM12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 10v.01M18 14v.01",
    chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    pie: "M12 3v9h9a9 9 0 11-9-9zM15 3.5A9 9 0 0120.5 9H15V3.5z",
    file: "M7 3h7l5 5v13H7V3zM14 3v5h5M10 13h6M10 17h6",
    print: "M7 8V3h10v5M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 14h10v7H7z",
    download: "M12 4v11M7 11l5 5 5-5M5 20h14",
    upload: "M12 16V5M7 9l5-5 5 5M5 20h14",
    share: "M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
    whatsapp: "M3 21l1.6-4.8A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4-1L3 21zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4 4 0 01-2.3-2.3l.8-1-1-2L9 8.5z",
    link: "M10 14a4 4 0 005.7 0l3-3A4 4 0 0013 5.3l-1 1M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1",
    menu: "M4 6h16M4 12h16M4 18h16",
    bell: "M6 17V11a6 6 0 1112 0v6l2 2H4l2-2zM10 21h4",
    star: "M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9L12 3z",
    trophy: "M8 4h8v6a4 4 0 01-8 0V4zM8 6H4v1a4 4 0 004 4M16 6h4v1a4 4 0 01-4 4M12 14v4M8 21h8M10 18h4",
    list: "M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01",
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
    cards: "M7 7h12a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zM3 15V6a2 2 0 012-2h11",
    scan: "M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16",
    award: "M12 15a6 6 0 100-12 6 6 0 000 12zM8.5 14l-1.5 7 5-3 5 3-1.5-7",
    folder: "M3 6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V6z",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z",
    moon: "M21 13A9 9 0 1111 3a7 7 0 0010 10z",
    sun: "M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
    lock: "M6 11h12v9H6zM8 11V8a4 4 0 118 0v3",
    alert: "M12 3l10 18H2L12 3zM12 10v5M12 18v.01",
    info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8v.01",
    copy: "M9 9h11v11H9zM5 15V5h10",
    play: "M7 4l13 8-13 8V4z",
    pause: "M8 5v14M16 5v14",
    refresh: "M20 11a8 8 0 00-14.9-3M4 4v4h4M4 13a8 8 0 0014.9 3M20 20v-4h-4",
    image: "M4 5h16v14H4zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 17l5-5 4 4 3-3 4 4",
    wallet: "M3 7a2 2 0 012-2h13v4M3 7v11a2 2 0 002 2h15V9H5a2 2 0 01-2-2zM16 14.5v.01",
    tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 8v.01",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
    layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
    target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12v.01",
    wand: "M5 19L17 7l2 2L7 21l-2-2zM15 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z",
    arrow: "M19 12H5M11 6l-6 6 6 6",
    chev: "M9 6l6 6-6 6",
    down: "M6 9l6 6 6-6",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2.2 2.2L15 10",
    music: "M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z",
    qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z",
    flag: "M5 21V4M5 4h11l-2 4 2 4H5"
  };
  FT.icon = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n] || P.info}"/></svg>`;
  FT.I = FT.icon;
  FT.logoSvg = `<svg viewBox="0 0 32 32" fill="none"><path d="M6 24V8h13M6 16h9" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 24l3-3 3 3" stroke="#f5b942" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ---------- التخزين ---------- */
  const KEY = () => "ft:" + FT.cfg.id;
  const blank = () => ({
    v: 1,
    meta: { teacher: "", subject: "", phone: "", school: "", currency: "ج.م", logo: "", theme: "light", runnerBase: "", created: D.today() },
    students: [], groups: [], sessions: [], marks: [], exams: [], grades: [], homework: [], hwStatus: [],
    payments: [], expenses: [], fees: [], lessons: [], qbank: [], onlineExams: [], decks: [], competitions: [],
    schedule: [], certs: [], worksheets: [], notes: []
  });
  FT.blank = blank;
  let memFallback = null;
  FT.load = () => {
    let raw = null;
    try { raw = localStorage.getItem(KEY()); } catch (e) { }
    let db = null;
    if (raw) { try { db = JSON.parse(raw); } catch (e) { db = null; } }
    if (!db && memFallback) db = memFallback;
    const b = blank();
    FT.db = Object.assign(b, db || {});
    FT.db.meta = Object.assign(b.meta, (db && db.meta) || {});
    FT.applyTheme();
    return FT.db;
  };
  let saveT = null;
  FT.save = (now) => {
    const go = () => {
      memFallback = FT.db;
      try { localStorage.setItem(KEY(), JSON.stringify(FT.db)); FT.saveFail = false; } catch (e) { FT.saveFail = true; FT.toast("المساحة المخزنة امتلأت — حمّل نسخة احتياطية الآن", "bad"); }
    };
    if (now) { clearTimeout(saveT); go(); } else { clearTimeout(saveT); saveT = setTimeout(go, 120); }
  };
  FT.applyTheme = () => { document.documentElement.dataset.theme = FT.db.meta.theme === "dark" ? "dark" : "light"; };
  FT.backup = () => {
    const blob = new Blob([JSON.stringify({ product: FT.cfg.id, at: new Date().toISOString(), data: FT.db })], { type: "application/json" });
    FT.saveBlob(blob, `${FT.cfg.id}-backup-${D.today()}.json`);
  };
  FT.restore = file => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => { try { const j = JSON.parse(r.result); if (!j.data || !j.data.meta) throw 0; FT.db = Object.assign(blank(), j.data); FT.resetStates(); FT.save(true); res(); } catch (e) { rej(new Error("الملف ده مش نسخة احتياطية صالحة")); } };
    r.onerror = () => rej(new Error("تعذّرت قراءة الملف"));
    r.readAsText(file);
  });
  FT.saveBlob = (blob, name) => {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  };
  FT.csv = (rows, name) => {
    const q = v => { v = v == null ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    const txt = "﻿" + rows.map(r => r.map(q).join(",")).join("\r\n");
    FT.saveBlob(new Blob([txt], { type: "text/csv;charset=utf-8" }), name);
  };
  FT.parseCSV = txt => {
    const rows = []; let row = [], cur = "", inq = false;
    txt = txt.replace(/^﻿/, "");
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (inq) { if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else inq = false; } else cur += c; }
      else if (c === '"') inq = true;
      else if (c === "," || c === "\t" || c === ";") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && txt[i + 1] === "\n") i++; row.push(cur); if (row.some(x => x.trim() !== "")) rows.push(row); row = []; cur = ""; }
      else cur += c;
    }
    row.push(cur); if (row.some(x => x.trim() !== "")) rows.push(row);
    return rows;
  };

  /* ---------- واجهة: إشعارات ونوافذ ---------- */
  FT.toast = (msg, type = "") => {
    let box = FT.$(".toasts"); if (!box) { box = document.createElement("div"); box.className = "toasts"; box.setAttribute("role", "status"); document.body.appendChild(box); }
    const t = document.createElement("div"); t.className = "toast " + type; t.textContent = msg; box.appendChild(t);
    setTimeout(() => t.remove(), 3600);
  };
  FT.modal = (title, body, opts = {}) => {
    const w = document.createElement("div"); w.className = "modal-wrap";
    w.innerHTML = `<div class="modal ${opts.size || ""}" role="dialog" aria-modal="true" aria-label="${FT.esc(title)}"><div class="m-head"><h3>${FT.esc(title)}</h3><button class="icon-btn" data-close aria-label="إغلاق">${FT.icon("x")}</button></div><div class="m-body">${body}</div>${opts.foot === false ? "" : `<div class="m-foot"></div>`}</div>`;
    document.body.appendChild(w);
    const close = () => { w.remove(); document.removeEventListener("keydown", esc); if (opts.onClose) opts.onClose(); };
    const esc = e => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", esc);
    w.addEventListener("mousedown", e => { if (e.target === w && !opts.sticky) close(); });
    w.querySelector("[data-close]").onclick = close;
    const foot = w.querySelector(".m-foot");
    const api = { el: w, body: w.querySelector(".m-body"), close };
    if (foot) (opts.buttons || []).forEach(b => {
      const btn = document.createElement("button"); btn.className = "btn " + (b.cls || ""); btn.innerHTML = b.label;
      btn.onclick = async () => { const r = b.onClick ? await b.onClick(api, btn) : undefined; if (r !== false && b.close !== false) close(); };
      foot.appendChild(btn);
    });
    const f = w.querySelector("input:not([type=hidden]),select,textarea"); if (f && !opts.noFocus) setTimeout(() => f.focus(), 30);
    return api;
  };
  FT.confirm = (msg, okLabel = "تأكيد", danger = true) => new Promise(res => {
    let done = false;
    FT.modal("تأكيد", `<p>${FT.esc(msg)}</p>`, { size: "sm", onClose: () => { if (!done) res(false); }, buttons: [
      { label: okLabel, cls: danger ? "danger" : "", onClick: () => { done = true; res(true); } },
      { label: "إلغاء", cls: "ghost", onClick: () => { done = true; res(false); } }] });
  });
  /* نموذج جاهز: fields = [{k,label,type,value,options,half,placeholder,hint,req}] */
  FT.form = (title, fields, onSave, opts = {}) => {
    const fh = f => {
      const id = "ff_" + f.k, v = f.value == null ? "" : f.value;
      let c;
      if (f.type === "select") c = `<select id="${id}">${f.options.map(o => { const [ov, ol] = Array.isArray(o) ? o : [o, o]; return `<option value="${FT.esc(ov)}" ${String(ov) === String(v) ? "selected" : ""}>${FT.esc(ol)}</option>`; }).join("")}</select>`;
      else if (f.type === "textarea") c = `<textarea id="${id}" placeholder="${FT.esc(f.placeholder || "")}">${FT.esc(v)}</textarea>`;
      else if (f.type === "checks") c = `<div class="checks" id="${id}">${f.options.map(o => { const [ov, ol] = Array.isArray(o) ? o : [o, o]; return `<label><input type="checkbox" value="${FT.esc(ov)}" ${(v || []).includes(ov) ? "checked" : ""}>${FT.esc(ol)}</label>`; }).join("")}</div>`;
      else if (f.type === "check") c = `<label class="chk"><input type="checkbox" id="${id}" ${v ? "checked" : ""}>${FT.esc(f.label)}</label>`;
      else c = `<input id="${id}" type="${f.type || "text"}" value="${FT.esc(v)}" placeholder="${FT.esc(f.placeholder || "")}" ${f.type === "number" ? 'inputmode="decimal" step="any"' : ""} ${f.min != null ? `min="${f.min}"` : ""} ${f.max != null ? `max="${f.max}"` : ""}>`;
      return `<div class="f ${f.half ? "half" : ""} ${f.third ? "third" : ""}">${f.type === "check" ? "" : `<span>${FT.esc(f.label)}${f.req ? " *" : ""}</span>`}${c}${f.hint ? `<small>${FT.esc(f.hint)}</small>` : ""}</div>`;
    };
    const m = FT.modal(title, `<div class="fgrid">${fields.map(fh).join("")}</div>`, Object.assign({}, opts, { buttons: [
      { label: opts.saveLabel || "حفظ", cls: "gold", onClick: async (api) => {
        const out = {}; let bad = false;
        fields.forEach(f => {
          const el = FT.$("#ff_" + f.k, api.el); let v;
          if (f.type === "checks") v = FT.$$("input:checked", el).map(i => i.value);
          else if (f.type === "check") v = el.checked;
          else if (f.type === "number") v = el.value === "" ? "" : FT.num(el.value);
          else v = el.value.trim();
          out[f.k] = v;
          const empty = v === "" || (Array.isArray(v) && !v.length);
          if (f.req && empty) { bad = true; el.classList && el.classList.add("bad"); } else if (el.classList) el.classList.remove("bad");
        });
        if (bad) { FT.toast("كمّل الحقول اللي عليها نجمة", "bad"); return false; }
        const r = await onSave(out, api); return r;
      } },
      { label: "إلغاء", cls: "ghost" }] }));
    return m;
  };
  FT.empty = (icon, title, text, btn) => `<div class="empty"><div class="e-ic">${FT.icon(icon)}</div><h3>${FT.esc(title)}</h3><p>${FT.esc(text)}</p>${btn || ""}</div>`;
  FT.pageHead = (title, sub, acts) => `<div class="ph"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div><div class="acts">${acts || ""}</div></div>`;
  FT.kpi = (label, val, sub, cls = "", icon = "") => `<div class="kpi ${cls}"><div class="k-l">${icon ? FT.icon(icon) : ""}${label}</div><div class="k-v">${val}</div>${sub ? `<div class="k-s">${sub}</div>` : ""}</div>`;
  /* تفويض أحداث: FT.on(root,'click','[data-act]',(e,el)=>{}) */
  FT.on = (root, ev, sel, fn) => root.addEventListener(ev, e => { const el = e.target.closest(sel); if (el && root.contains(el)) fn(e, el); });

  /* ---------- طباعة / PDF ---------- */
  FT.printHTML = (html, title, cssOverride) => {
    let f = FT.$("#printFrame");
    if (f) f.remove();
    f = document.createElement("iframe"); f.id = "printFrame"; f.style.cssText = "position:fixed;left:-9999px;top:0;width:210mm;height:297mm;border:0";
    document.body.appendChild(f);
    const css = cssOverride || FT.printCSS || "";
    f.contentDocument.open();
    f.contentDocument.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${FT.esc(title || FT.cfg.name)}</title><style>${css}</style></head><body>${html}</body></html>`);
    f.contentDocument.close();
    const go = () => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { FT.toast("تعذّرت الطباعة", "bad"); } };
    setTimeout(go, 350);
  };
  FT.printCSS = `
  *{box-sizing:border-box}body{font-family:'IBM Plex Sans Arabic','Cairo','Segoe UI',Tahoma,'DejaVu Sans',sans-serif;color:#111;margin:0;font-size:12.5pt;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{size:A4;margin:12mm}
  h1,h2,h3{margin:0 0 6px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #9aa4bd;padding:5px 8px;text-align:right}th{background:#e8edf8}
  .pg{page-break-after:always;padding:0}.pg:last-child{page-break-after:auto}.pbi{page-break-inside:avoid}
  .hd{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #0f1c3a;padding-bottom:8px;margin-bottom:12px}
  .hd b{font-size:15pt}.hd small{color:#555}.gold{color:#c98412}.c{text-align:center}.muted{color:#666}
  `;
  FT.printHeader = (title, sub) => `<div class="hd"><div><b>${FT.esc(title)}</b><br><small>${FT.esc(sub || "")}</small></div><div style="text-align:left"><b>${FT.esc(FT.db.meta.teacher || "")}</b><br><small>${FT.esc(FT.db.meta.subject || "")} ${FT.esc(FT.db.meta.school ? "· " + FT.db.meta.school : "")}</small></div></div>`;

  /* ---------- واتساب ---------- */
  FT.phoneEG = p => { p = FT.toEn(p).replace(/[^\d+]/g, ""); if (p.startsWith("+")) return p.slice(1); if (p.startsWith("00")) return p.slice(2); if (p.startsWith("0")) return "20" + p.slice(1); if (p.length === 10 && p.startsWith("1")) return "20" + p; return p; };
  FT.waLink = (phone, text) => "https://wa.me/" + (phone ? FT.phoneEG(phone) : "") + "?text=" + encodeURIComponent(text);
  FT.wa = (phone, text) => window.open(FT.waLink(phone, text), "_blank", "noopener");
  FT.copy = async (txt, msg = "تم النسخ") => {
    try { await navigator.clipboard.writeText(txt); } catch (e) { const t = document.createElement("textarea"); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (_) { } t.remove(); }
    FT.toast(msg, "ok");
  };

  /* ---------- ضغط وتشفير (روابط بدون سيرفر) ---------- */
  const b64u = {
    enc: u8 => { let s = ""; u8.forEach(b => s += String.fromCharCode(b)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); },
    dec: s => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; const b = atob(s); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  };
  FT.b64u = b64u;
  const streamTo = async (u8, S) => new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new S("deflate-raw"))).arrayBuffer());
  FT.codec = {
    async pack(obj) {
      const u8 = new TextEncoder().encode(JSON.stringify(obj));
      if (typeof CompressionStream !== "undefined") { try { return "z" + b64u.enc(await streamTo(u8, CompressionStream)); } catch (e) { } }
      return "r" + b64u.enc(u8);
    },
    async unpack(s) {
      const t = s[0], u8 = b64u.dec(s.slice(1));
      const out = t === "z" ? await streamTo(u8, DecompressionStream) : u8;
      return JSON.parse(new TextDecoder().decode(out));
    }
  };
  FT.crypt = {
    async key(pin, salt) {
      const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
      return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    },
    async enc(obj, pin) {
      const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
      const k = await this.key(pin, salt);
      const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, new TextEncoder().encode(JSON.stringify(obj))));
      const out = new Uint8Array(28 + ct.length); out.set(salt, 0); out.set(iv, 16); out.set(ct, 28);
      return b64u.enc(out);
    },
    async dec(str, pin) {
      const u = b64u.dec(str); const k = await this.key(pin, u.slice(0, 16));
      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(16, 28) }, k, u.slice(28));
      return JSON.parse(new TextDecoder().decode(pt));
    }
  };
  /* رابط صفحة مستضافة (exam/parent/study) */
  FT.runnerURL = (page, payload) => {
    let base = (FT.db && FT.db.meta.runnerBase) || FT.cfg.runnerBase || "";
    if (!base) return "";
    if (!base.endsWith("/")) base += "/";
    return base + page + ".html#" + payload;
  };
  FT.needRunner = () => {
    if ((FT.db.meta.runnerBase || FT.cfg.runnerBase)) return true;
    FT.form("رابط صفحات المشاركة", [{ k: "u", label: "رابط الموقع المستضاف", placeholder: "https://اسمك.github.io/fasl-runner/", hint: "ده الرابط اللي هتبعتهولك FASL TECH مع المنتج. بنحتاجه علشان روابط الطلاب وأولياء الأمور تشتغل.", req: true }],
      d => { FT.db.meta.runnerBase = d.u; FT.save(true); FT.toast("تم الحفظ — جرّب تاني", "ok"); });
    return false;
  };

  /* ---------- تسجيل الوحدات والتوجيه ---------- */
  FT.register = m => { FT.modules.push(m); };
  FT.go = id => { location.hash = "#/" + id; };
  FT.refresh = () => FT.route && FT.route();
  FT.resetStates = () => ["attState", "gradeState", "homeworkState", "moneyState", "repState", "qbState", "omrState", "plState", "certState", "wsState", "cmpState", "parState", "cardState", "wsState"].forEach(k => delete FT[k]);

  /* ---------- دوال بيانات مشتركة ---------- */
  FT.student = id => FT.db.students.find(s => s.id === id);
  FT.group = id => FT.db.groups.find(x => x.id === id);
  FT.studentName = id => (FT.student(id) || { name: "(محذوف)" }).name;
  FT.groupStudents = gid => FT.db.students.filter(s => s.groupId === gid && !s.archived);
  FT.activeStudents = () => FT.db.students.filter(s => !s.archived);
  FT.sortAr = (a, b) => String(a).localeCompare(String(b), "ar");
  FT.msgTpl = (t, o) => t.replace(/\{(\w+)\}/g, (_, k) => o[k] != null ? o[k] : "");
})(window);
