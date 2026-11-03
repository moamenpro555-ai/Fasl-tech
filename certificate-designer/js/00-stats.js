/* ===================== حسابات مشتركة بين الوحدات ===================== */
(function () {
  const FT = window.FT, D = FT.date;
  const S = FT.stats = {};

  S.marksOf = sid => FT.db.marks.filter(m => m.studentId === sid);
  S.att = (sid, since) => {
    const sess = since ? new Set(FT.db.sessions.filter(s => s.date >= since).map(s => s.id)) : null;
    const ms = S.marksOf(sid).filter(m => !sess || sess.has(m.sessionId));
    const p = ms.filter(m => m.s === "p").length, l = ms.filter(m => m.s === "l").length, a = ms.filter(m => m.s === "a").length, e = ms.filter(m => m.s === "e").length;
    const den = p + l + a;
    return { p, l, a, e, total: ms.length, rate: den ? Math.round((p + l) / den * 100) : null };
  };
  S.examPct = (g) => { const e = FT.db.exams.find(x => x.id === g.examId); return e && e.max ? g.score / e.max * 100 : null; };
  S.grades = sid => FT.db.grades.filter(g => g.studentId === sid).map(g => { const e = FT.db.exams.find(x => x.id === g.examId); return e ? { exam: e, score: g.score, pct: e.max ? g.score / e.max * 100 : 0 } : null; }).filter(Boolean).sort((a, b) => a.exam.date.localeCompare(b.exam.date));
  S.avgGrade = sid => { const g = S.grades(sid); return g.length ? FT.round(FT.avg(g.map(x => x.pct)), 1) : null; };
  S.hw = sid => {
    const hs = FT.db.hwStatus.filter(h => h.studentId === sid);
    const done = hs.filter(h => h.s === "done").length, late = hs.filter(h => h.s === "late").length, part = hs.filter(h => h.s === "partial").length, miss = hs.filter(h => h.s === "missing").length;
    const tot = hs.length;
    return { done, late, part, miss, total: tot, rate: tot ? Math.round((done + late * .7 + part * .4) / tot * 100) : null };
  };
  S.fee = sid => { const s = FT.student(sid); if (!s) return 0; if (s.fee !== "" && s.fee != null && !isNaN(s.fee)) return Number(s.fee); const g = FT.group(s.groupId); return g ? Number(g.fee) || 0 : 0; };
  S.paid = (sid, ym) => FT.sum(FT.db.payments.filter(p => p.studentId === sid && (!ym || p.month === ym)).map(p => p.amount));
  S.balance = (sid, ym) => S.fee(sid) - S.paid(sid, ym);
  /* كل الشهور اللي عليها مستحقات للطالب من أول دفعة/انضمام لحد الشهر الحالي */
  S.months = (sid) => {
    const s = FT.student(sid); if (!s) return [];
    const first = D.ym(s.joined || D.today()), cur = D.ym(D.today()); const out = []; let m = first;
    const pm = FT.db.payments.filter(p => p.studentId === sid).map(p => p.month).sort()[0]; if (pm && pm < m) m = pm;
    while (m <= cur && out.length < 36) { out.push(m); m = D.ym(D.addMonths(m + "-01", 1)); }
    return out;
  };
  S.arrears = sid => FT.sum(S.months(sid).map(ym => Math.max(0, S.balance(sid, ym))));
  S.hwOwed = ym => ym;
  S.risk = sid => {
    const a = S.att(sid, D.add(D.today(), -42)), g = S.avgGrade(sid), h = S.hw(sid); let pts = 0; const why = [];
    if (a.rate != null && a.rate < 70) { pts += 2; why.push("حضور ضعيف " + a.rate + "%"); } else if (a.rate != null && a.rate < 82) { pts += 1; why.push("حضور متذبذب"); }
    if (g != null && g < 50) { pts += 2; why.push("متوسط درجات " + g + "%"); } else if (g != null && g < 65) { pts += 1; why.push("درجات تحتاج دعم"); }
    if (h.rate != null && h.rate < 50) { pts += 1; why.push("واجبات ناقصة"); }
    return { level: pts >= 3 ? "high" : pts >= 1 ? "mid" : "low", pts, why };
  };
  S.riskBadge = r => r.level === "high" ? `<span class="badge bad">محتاج متابعة</span>` : r.level === "mid" ? `<span class="badge warn">انتبه</span>` : `<span class="badge ok">ممتاز</span>`;
  S.gradeLabel = p => p == null ? "—" : p >= 90 ? "ممتاز" : p >= 80 ? "جيد جدًا" : p >= 65 ? "جيد" : p >= 50 ? "مقبول" : "ضعيف";
  S.gradeCls = p => p == null ? "" : p >= 80 ? "ok" : p >= 50 ? "warn" : "bad";
  S.groupAtt = (gid, since) => { const ss = FT.groupStudents(gid).map(s => S.att(s.id, since)).filter(x => x.rate != null); return ss.length ? Math.round(FT.avg(ss.map(x => x.rate))) : null; };
  S.rank = (gid, examId) => FT.db.grades.filter(g => g.examId === examId && FT.groupStudents(gid).some(s => s.id === g.studentId)).sort((a, b) => b.score - a.score);
  S.monthRevenue = ym => FT.sum(FT.db.payments.filter(p => p.month === ym || (!p.month && p.date.startsWith(ym))).map(p => p.amount));
  S.cashIn = ym => FT.sum(FT.db.payments.filter(p => p.date.startsWith(ym)).map(p => p.amount));
  S.expenses = ym => FT.sum(FT.db.expenses.filter(e => e.date.startsWith(ym)).map(e => e.amount));
})();
