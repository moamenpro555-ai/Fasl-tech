(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon, root = document.getElementById("rn");
  const head = sub => `<div class="rn-top"><div class="logo">${FT.logoSvg}</div><div><b>FASL TECH</b><small>${E(sub || "تقرير ولي الأمر")}</small></div></div>`;
  const ST = { p: ["حاضر", "ok"], a: ["غايب", "bad"], l: ["متأخر", "warn"], e: ["بعذر", "info"] };
  let blob;
  document.addEventListener("DOMContentLoaded", () => {
    blob = location.hash.slice(1);
    if (!blob) { root.innerHTML = head() + `<div class="card center">${FT.empty("alert", "الرابط ناقص", "اطلب من المدرس يبعت الرابط كامل تاني.")}</div>`; return; }
    lock();
  });
  function lock(err) {
    root.innerHTML = head() + `<div class="card center" style="max-width:420px;margin:30px auto"><div class="big-ok" style="background:var(--gold-soft);color:var(--gold-2)">${I("lock")}</div><h2 style="font-size:1.3rem">تقرير الطالب</h2><p class="muted mt" style="margin-top:6px">اكتب الرقم السري اللي بعته المدرس</p><input id="pin" type="tel" inputmode="numeric" maxlength="8" autocomplete="off" style="text-align:center;font-size:1.6rem;letter-spacing:8px;margin-top:16px;direction:ltr" placeholder="••••">${err ? `<div class="note bad mt" style="margin-top:12px;text-align:right">${I("alert")}<div>${E(err)}</div></div>` : ""}<button class="btn gold lg" id="ok" style="width:100%;margin-top:16px">فتح التقرير</button></div>`;
    const go = async () => { const pin = FT.toEn(document.getElementById("pin").value.trim()); if (!pin) return; const b = document.getElementById("ok"); b.disabled = true; b.textContent = "جاري الفتح…"; try { const o = await FT.crypt.dec(blob, pin); show(await FT.codec.unpack(o.p)); } catch (e) { lock("الرقم السري غلط، أو الرابط اتقطع. جرّب تاني."); } };
    document.getElementById("ok").onclick = go; document.getElementById("pin").onkeydown = e => { if (e.key === "Enter") go(); }; document.getElementById("pin").focus();
  }
  function show(X) {
    document.title = X.n + " | FASL TECH";
    const [rate, p, a, l, e] = X.a, hw = X.hw, gr = X.gr, avg = gr.length ? Math.round(FT.avg(gr.map(g => g[2] / g[3] * 100))) : null;
    const col = v => v == null ? "var(--muted)" : v >= 85 ? "var(--ok)" : v >= 60 ? "var(--warn)" : "var(--bad)";
    root.innerHTML = head("تقرير " + FT.date.fmt(X.d)) + `<div class="rn-hero"><h1>${E(X.n)}</h1><p>${E(X.g || "")} — ${E(X.sb || "")} مع ${E(X.t || "")}</p></div>
    <div class="grid g3 mb" style="grid-template-columns:repeat(3,1fr);gap:10px"><div class="card center tight"><div class="xs muted">الحضور</div>${rate == null ? "—" : FT.charts.ring(rate, { size: 90 })}<div class="xs muted">${p + l} حضور · ${a} غياب</div></div><div class="card center tight"><div class="xs muted">متوسط الدرجات</div>${avg == null ? "—" : FT.charts.ring(avg, { size: 90 })}<div class="xs muted">${gr.length} اختبار</div></div><div class="card center tight"><div class="xs muted">الواجبات</div>${hw[0] == null ? "—" : FT.charts.ring(hw[0], { size: 90 })}<div class="xs muted">${hw[1]} من ${hw[2]}</div></div></div>
    <div class="card mb"><div class="h3">ملاحظة المدرس</div><p style="font-size:1.05rem;line-height:1.9">${E(X.note)}</p></div>
    ${gr.length > 1 ? `<div class="card mb"><div class="h3">تطوّر الدرجات <span class="xs muted">(الخط = الطالب)</span></div>${FT.charts.line(gr.map(g => ({ l: FT.date.short(g[1]), v: Math.round(g[2] / g[3] * 100) })), { max: 100, unit: "%", h: 190 })}</div>` : ""}
    <div class="card mb"><div class="h3">آخر الاختبارات</div>${gr.slice().reverse().map(g => { const pc = Math.round(g[2] / g[3] * 100); return `<div style="padding:10px 0;border-bottom:1px solid var(--line)"><div class="row between"><b>${E(g[0])}</b><b style="color:${col(pc)}">${g[2]} / ${g[3]}</b></div><div class="row between xs muted"><span>${FT.date.fmt(g[1])}</span>${g[4] != null ? `<span>متوسط المجموعة ${g[4]}%</span>` : ""}</div><div class="prog ${pc < 50 ? "bad" : pc < 70 ? "warn" : ""}" style="margin-top:5px"><i style="width:${pc}%"></i></div></div>`; }).join("") || `<p class="muted">لا توجد اختبارات بعد.</p>`}</div>
    <div class="card mb"><div class="h3">آخر الحصص</div><div class="row" style="gap:6px">${X.ses.map(s => `<span class="badge ${(ST[s[1]] || ["", ""])[1]}" title="${E(s[0])}">${FT.date.short(s[0])} · ${(ST[s[1]] || ["—"])[0]}</span>`).join("")}</div></div>
    ${X.fee ? `<div class="card mb"><div class="h3">المصروفات</div><div class="row between"><span>المطلوب شهريًا</span><b>${FT.fmt(X.fee[0])} ${E(X.cur || "")}</b></div><div class="row between"><span>المدفوع هذا الشهر</span><b>${FT.fmt(X.fee[1])}</b></div><div class="row between"><span>إجمالي المتبقي</span><b style="color:${X.fee[2] > 0 ? "var(--bad)" : "var(--ok)"}">${FT.fmt(X.fee[2])}</b></div></div>` : ""}
    ${X.ph ? `<a class="btn wa lg" style="width:100%" target="_blank" rel="noopener" href="${FT.waLink(X.ph, "السلام عليكم، بخصوص تقرير " + X.n)}">${I("whatsapp")} تواصل مع المدرس</a>` : ""}
    <p class="muted xs center mt2">هذا التقرير صورة بتاريخ ${FT.date.fmt(X.d)} · FASL TECH</p>`;
  }
})();
