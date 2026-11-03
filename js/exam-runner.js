/* واجهة الطالب لحل الامتحان — بدون سيرفر */
(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon, LET = ["أ", "ب", "ج", "د", "هـ"];
  const root = document.getElementById("rn");
  const head = (sub) => `<div class="rn-top"><div class="logo">${FT.logoSvg}</div><div><b>FASL TECH</b><small>${E(sub || "امتحان أونلاين")}</small></div></div>`;
  const fail = (t, d) => { root.innerHTML = head() + `<div class="card center">${FT.empty("alert", t, d)}</div>`; };
  let X, key, S;
  const save = () => { try { localStorage.setItem(key, JSON.stringify(S)); } catch (e) { } };

  async function init() {
    let h = location.hash.slice(1);
    if (!h) return fail("الرابط ناقص", "اطلب من مدرسك يبعتلك الرابط كامل تاني.");
    try { X = await FT.codec.unpack(h); } catch (e) { return fail("الرابط تالف", "الرابط اتقطع في الطريق (واتساب أحيانًا بيقطع الروابط الطويلة). اطلب من مدرسك يبعته تاني."); }
    key = "ftx:" + X.id;
    try { S = JSON.parse(localStorage.getItem(key)); } catch (e) { S = null; }
    document.title = X.t + " | FASL TECH";
    if (S && S.done) return finish(true);
    if (S && S.start) return run();
    start();
  }
  const tot = () => X.q.reduce((s, q) => s + q[3], 0);
  function start() {
    root.innerHTML = head(X.tn ? "مع " + X.tn : "") + `<div class="rn-hero"><h1>${E(X.t)}</h1><p>${E(X.sb || "")}</p><div class="rn-chips"><span>${X.q.length} سؤال</span><span>${X.d} دقيقة</span><span>${tot()} درجة</span></div></div>
    <div class="card">${X.ins ? `<div class="note mb">${I("info")}<div>${E(X.ins)}</div></div>` : ""}<div class="f"><span>اكتب اسمك الثلاثي</span><input id="nm" autocomplete="name" placeholder="الاسم بالكامل"></div>
    <div class="note warn mt">${I("clock")}<div>التايمر بيبدأ أول ما تضغط «ابدأ» ومبيقفش لو قفلت الصفحة. تقدر ترجع لنفس الامتحان لو الصفحة اتقفلت بالغلط.</div></div><button class="btn gold lg mt" id="go" style="width:100%">ابدأ الامتحان</button></div>`;
    document.getElementById("go").onclick = () => {
      const n = document.getElementById("nm").value.trim(); if (n.split(/\s+/).length < 2) { document.getElementById("nm").classList.add("bad"); return FT.toast("اكتب اسمك الثلاثي", "bad"); }
      const order = X.q.map((_, i) => i); const ord = X.sq ? FT.shuffle(order) : order;
      S = { name: n, start: Date.now(), order: ord, perm: X.q.map(q => q[0] === "mcq" && X.so ? FT.shuffle(q[2].map((_, k) => k)) : q[2].map((_, k) => k)), a: X.q.map(() => -1), cur: 0 };
      save(); run();
    };
  }
  let tmr;
  function run() {
    const end = S.start + X.d * 60000;
    const draw = () => {
      const qi = S.order[S.cur], q = X.q[qi], [type, text, opts] = q, perm = S.perm[qi];
      const answered = S.a.filter(a => a !== -1 && a !== "").length;
      root.innerHTML = head(X.t) + `<div class="q-top"><div class="q-bar"><div class="timer" id="tm">--:--</div><div class="grow"><div class="prog gold"><i style="width:${answered / X.q.length * 100}%"></i></div></div><b class="sm">${answered}/${X.q.length}</b></div></div>
      <div class="q-card"><div class="xs muted mb">سؤال ${S.cur + 1} من ${X.q.length} · ${q[3]} درجة</div><div class="q-text">${E(text)}</div>
      ${type === "essay" ? `<textarea id="es" rows="7" placeholder="اكتب إجابتك هنا">${E(S.a[qi] === -1 ? "" : S.a[qi])}</textarea>` : perm.map((p, k) => `<button class="opt ${S.a[qi] === p ? "on" : ""}" data-p="${p}"><span class="l">${LET[k]}</span><span>${E(opts[p])}</span></button>`).join("")}</div>
      <div class="nav-dots">${S.order.map((o, n) => `<button class="${S.a[o] !== -1 && S.a[o] !== "" ? "done" : ""} ${n === S.cur ? "cur" : ""}" data-n="${n}">${n + 1}</button>`).join("")}</div>
      <div class="rn-foot"><button class="btn ghost" id="pv" ${S.cur === 0 ? "disabled" : ""}>السابق</button>${S.cur === X.q.length - 1 ? `<button class="btn ok lg" id="fin">تسليم الامتحان</button>` : `<button class="btn" id="nx">التالي</button>`}</div>`;
      const go = n => { S.cur = n; save(); draw(); };
      document.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { S.a[qi] = +b.dataset.p; save(); draw(); });
      const es = document.getElementById("es"); if (es) es.oninput = () => { S.a[qi] = es.value; save(); };
      document.querySelectorAll("[data-n]").forEach(b => b.onclick = () => go(+b.dataset.n));
      const pv = document.getElementById("pv"), nx = document.getElementById("nx"), fin = document.getElementById("fin");
      if (pv) pv.onclick = () => go(S.cur - 1); if (nx) nx.onclick = () => go(S.cur + 1);
      if (fin) fin.onclick = () => { const left = S.a.filter(a => a === -1 || a === "").length; FT.modal("تسليم الامتحان؟", `<p>${left ? `لسه فاضل <b>${left}</b> سؤال من غير إجابة. ` : ""}بعد التسليم مش هتقدر تعدّل.</p>`, { size: "sm", buttons: [{ label: "سلّم", cls: "ok", onClick: () => submit() }, { label: "ارجع", cls: "ghost" }] }); };
      tick();
    };
    const tick = () => { clearInterval(tmr); const f = () => { const left = Math.max(0, Math.round((end - Date.now()) / 1000)); const el = document.getElementById("tm"); if (el) { el.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); el.classList.toggle("low", left < 120); } if (left <= 0) { clearInterval(tmr); submit(true); } }; f(); tmr = setInterval(f, 1000); };
    draw();
  }
  async function submit(auto) {
    clearInterval(tmr);
    S.done = true; S.secs = Math.min(X.d * 60, Math.round((Date.now() - S.start) / 1000)); S.auto = !!auto; save(); finish(false);
  }
  async function finish(again) {
    const code = "FT1." + await FT.codec.pack({ e: X.id, n: S.name, a: S.a, s: S.secs });
    let res = "";
    if (X.ins !== undefined && X.q[0] && X.q[0].length > 4) {
      let sc = 0; X.q.forEach((q, i) => { if (q[0] !== "essay" && S.a[i] === q[4]) sc += q[3]; });
      const has = X.q.some(q => q[0] === "essay");
      res = `<div class="card mb center"><div class="xs muted">نتيجتك</div><div style="font-size:2.4rem;font-weight:800">${Math.round(sc * 100) / 100} <span class="muted" style="font-size:1.1rem">/ ${tot()}</span></div>${has ? `<div class="muted sm">(بدون الأسئلة المقالية)</div>` : ""}</div>
      <div class="card mb"><div class="h3">مراجعة الإجابات</div>${X.q.map((q, i) => { if (q[0] === "essay") return ""; const ok = S.a[i] === q[4]; return `<div style="padding:9px 0;border-bottom:1px solid var(--line)"><b>${i + 1}. ${E(q[1])}</b><div class="sm" style="color:var(--${ok ? "ok" : "bad"})">إجابتك: ${S.a[i] === -1 ? "لم تجب" : E(q[2][S.a[i]])} ${ok ? "✓" : ""}</div>${ok ? "" : `<div class="sm" style="color:var(--ok)">الصحيح: ${E(q[2][q[4]])}</div>`}</div>`; }).join("")}</div>`;
    }
    const msg = `السلام عليكم ${X.tn || ""}\nأنا ${S.name}، سلّمت امتحان «${X.t}».\nكود النتيجة:\n${code}`;
    root.innerHTML = head(X.t) + `<div class="card center"><div class="big-ok">${I("check")}</div><h2 style="font-size:1.4rem">${again ? "إنت سلّمت الامتحان ده قبل كده" : S.auto ? "انتهى الوقت وتم تسليم إجاباتك" : "تم تسليم الامتحان"}</h2><p class="muted mt" style="margin-top:6px">آخر خطوة: ابعت الكود ده لمدرسك علشان تتحسب درجتك.</p>
      <div class="code-box mt">${E(code)}</div><div class="row mt" style="justify-content:center"><a class="btn wa lg" href="${FT.waLink(X.ph || "", msg)}" target="_blank" rel="noopener">${I("whatsapp")} إرسال الكود للمدرس</a><button class="btn ghost lg" id="cp">${I("copy")} نسخ الكود</button></div></div><div class="mt">${res}</div>`;
    document.getElementById("cp").onclick = () => FT.copy(code, "تم نسخ الكود");
  }
  document.addEventListener("DOMContentLoaded", init);
})();
