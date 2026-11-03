/* ===================== محرك المذاكرة (نظام لايتنر) — مشترك بين المنتج وصفحة الطالب ===================== */
(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon, D = FT.date;
  const INT = [0, 1, 3, 7, 14, 30];
  FT.study = {
    INT,
    mount(root, o) {
      const cards = o.cards, today = D.today();
      let queue = [], idx = 0, flipped = false, stats = { know: 0, again: 0 }, mode = "flip";
      const due = () => cards.filter(c => !c.due || c.due <= today);
      const start = (all, m) => {
        mode = m || "flip"; const src = all ? cards : due();
        queue = FT.shuffle(src); idx = 0; stats = { know: 0, again: 0 };
        if (!queue.length) return home(); show();
      };
      const home = () => {
        const bx = [1, 2, 3, 4, 5].map(b => cards.filter(c => (c.box || 1) === b).length), dn = due().length;
        root.innerHTML = `<div class="card center"><h2 style="font-size:1.35rem">${E(o.title)}</h2><p class="muted mt" style="margin-top:6px">${cards.length} بطاقة · مستحقة النهارده: <b>${dn}</b></p>
          <div class="row mt" style="justify-content:center;gap:14px;margin-top:16px">${bx.map((n, i) => `<div><div class="b" style="font-size:1.3rem">${n}</div><div class="xs muted">صندوق ${i + 1}</div></div>`).join("")}</div>
          <div class="prog gold mt" style="margin-top:14px"><i style="width:${FT.pct(bx[3] + bx[4], cards.length)}%"></i></div><div class="xs muted" style="margin-top:4px">${FT.pct(bx[3] + bx[4], cards.length)}% محفوظ جيدًا</div>
          <div class="col mt" style="margin-top:18px;max-width:340px;margin-inline:auto">${dn ? `<button class="btn gold lg" id="sGo">${I("play")} ابدأ المذاكرة (${dn})</button>` : `<div class="note ok">${I("check")}<div>خلّصت مذاكرة النهارده 👏 ارجع بكرة.</div></div>`}<button class="btn ghost" id="sAll">راجع كل البطاقات</button>${cards.length >= 4 ? `<button class="btn ghost" id="sQz">${I("target")} اختبرني (اختيار من متعدد)</button>` : ""}${o.onExit ? `<button class="btn ghost" id="sX">رجوع</button>` : ""}</div></div>`;
        const g = FT.$("#sGo", root); if (g) g.onclick = () => start(false);
        FT.$("#sAll", root).onclick = () => start(true); const q = FT.$("#sQz", root); if (q) q.onclick = () => start(true, "quiz"); const x = FT.$("#sX", root); if (x) x.onclick = o.onExit;
      };
      const mark = know => {
        const c = queue[idx]; if (!c) return;
        if (mode !== "quiz") {
          if (know) { c.box = Math.min(5, (c.box || 1) + 1); stats.know++; } else { c.box = 1; stats.again++; queue.push(c); }
          c.due = D.add(today, know ? INT[c.box] || 1 : 0); o.onUpdate && o.onUpdate(c);
        } else { know ? stats.know++ : stats.again++; }
        idx++; flipped = false; show();
      };
      const show = () => {
        if (idx >= queue.length) return done();
        const c = queue[idx], left = queue.length - idx;
        if (mode === "quiz") {
          const wrong = FT.shuffle(cards.filter(x => x.id !== c.id && x.b !== c.b)).slice(0, 3), opts = FT.shuffle([c].concat(wrong));
          root.innerHTML = `<div class="between row mb"><button class="btn ghost sm" id="sBk">${I("arrow")}</button><b>${idx + 1} / ${queue.length}</b></div><div class="prog gold mb"><i style="width:${idx / queue.length * 100}%"></i></div><div class="card center" style="padding:30px"><div class="muted sm">إيه الإجابة الصحيحة؟</div><div style="font-size:1.6rem;font-weight:800;margin:10px 0 20px">${E(c.f)}</div><div class="col">${opts.map(x => `<button class="btn ghost lg" data-o="${x.id}" style="justify-content:flex-start;white-space:normal;text-align:right">${E(x.b)}</button>`).join("")}</div></div>`;
          FT.on(root, "click", "[data-o]", (e, b) => { const ok = b.dataset.o === c.id; FT.$$("[data-o]", root).forEach(x => { x.disabled = true; if (x.dataset.o === c.id) x.className = "btn ok lg"; }); if (!ok) b.className = "btn danger lg"; setTimeout(() => mark(ok), ok ? 600 : 1400); });
          FT.$("#sBk", root).onclick = home; return;
        }
        root.innerHTML = `<div class="row between mb"><button class="btn ghost sm" id="sBk">${I("arrow")}</button><span class="muted sm">باقي ${left} بطاقة</span></div><div class="prog gold mb"><i style="width:${idx / queue.length * 100}%"></i></div>
          <div class="fc-wrap"><div class="fc ${flipped ? "flip" : ""}" id="fc" tabindex="0" role="button" aria-label="اقلب البطاقة"><div class="ff"><small>السؤال</small>${E(c.f)}</div><div class="fb"><small>الإجابة</small>${E(c.b)}</div></div></div>
          <div class="boxes mt" style="margin-top:14px">${[1, 2, 3, 4, 5].map(b => `<i class="${b <= (c.box || 1) ? "on" : ""}"></i>`).join("")}</div>
          <div class="row mt" style="justify-content:center;margin-top:18px;gap:12px" id="sAct">${flipped ? `<button class="btn danger lg" id="sNo">${I("x")} لسه مش حافظها</button><button class="btn ok lg" id="sYes">${I("check")} حافظها</button>` : `<button class="btn lg" id="sFl">اقلب البطاقة</button>`}</div><p class="muted xs center mt" style="margin-top:12px">مسطرة = قلب · ← مش حافظها · → حافظها</p>`;
        const fl = () => { flipped = true; FT.$("#fc", root).classList.add("flip"); FT.$("#sAct", root).innerHTML = `<button class="btn danger lg" id="sNo">${I("x")} لسه مش حافظها</button><button class="btn ok lg" id="sYes">${I("check")} حافظها</button>`; bind(); };
        const bind = () => { const n = FT.$("#sNo", root), y = FT.$("#sYes", root); if (n) { n.onclick = () => mark(false); y.onclick = () => mark(true); } };
        FT.$("#fc", root).onclick = () => { if (!flipped) fl(); else { flipped = false; FT.$("#fc", root).classList.remove("flip"); FT.$("#sAct", root).innerHTML = `<button class="btn lg" id="sFl">اقلب البطاقة</button>`; const f = FT.$("#sFl", root); f.onclick = fl; } };
        const f = FT.$("#sFl", root); if (f) f.onclick = fl; bind(); FT.$("#sBk", root).onclick = home;
      };
      const done = () => { root.innerHTML = `<div class="card center"><div class="big-ok" style="width:84px;height:84px;border-radius:50%;background:var(--ok-bg);color:var(--ok);display:grid;place-items:center;margin:6px auto 14px">${I("trophy")}</div><h2 style="font-size:1.4rem">خلّصت الجلسة!</h2><p class="muted mt">حافظ: <b style="color:var(--ok)">${stats.know}</b> · محتاج مراجعة: <b style="color:var(--bad)">${stats.again}</b></p><div class="row mt" style="justify-content:center"><button class="btn gold" id="sH">تمام</button></div></div>`; FT.$("#sH", root).onclick = home; };
      if (!root._keys) { root._keys = true; document.addEventListener("keydown", e => { if (!document.body.contains(root) || !FT.$("#fc", root)) return; if (e.code === "Space") { e.preventDefault(); FT.$("#fc", root).click(); } else if (flipped && e.key === "ArrowRight") FT.$("#sYes", root) && FT.$("#sYes", root).click(); else if (flipped && e.key === "ArrowLeft") FT.$("#sNo", root) && FT.$("#sNo", root).click(); }); }
      home();
    }
  };
})();
