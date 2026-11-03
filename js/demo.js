/* ===================== بيانات تجريبية واقعية ===================== */
(function () {
  const FT = window.FT, D = FT.date;
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const NAMES = ["أحمد محمد", "محمود علي", "عمر حسن", "يوسف إبراهيم", "مصطفى سعيد", "كريم عادل", "زياد طارق", "آدم خالد", "مريم أحمد", "نور محمود", "سلمى حسام", "ملك عمرو", "ياسمين ماجد", "فرح وليد", "هنا شريف", "جني أيمن", "حمزة رضا", "ليلى ياسر", "عبدالله هشام", "تقى سامح", "إياد نبيل", "رودينا صلاح", "مازن فتحي", "بسملة جمال"];

  FT.demo = function () {
    const db = FT.db, today = D.today(); seed = 7;
    ["students", "groups", "sessions", "marks", "exams", "grades", "homework", "hwStatus", "payments", "expenses", "lessons", "qbank", "schedule", "decks", "certs", "competitions", "onlineExams", "worksheets"].forEach(k => db[k] = []);
    const G = [
      { id: FT.uid(), name: "تالتة إعدادي — السبت", grade: "الثالث الإعدادي", fee: 250, days: [6, 2], time: "16:00", room: "السنتر", color: "#2f66dc" },
      { id: FT.uid(), name: "تانية ثانوي — الأحد", grade: "الثاني الثانوي", fee: 350, days: [0, 3], time: "18:00", room: "السنتر", color: "#14966a" },
      { id: FT.uid(), name: "أولى ثانوي — الإثنين", grade: "الأول الثانوي", fee: 300, days: [1, 4], time: "14:00", room: "المنزل", color: "#d98b0b" }
    ];
    db.groups = G;
    let ni = 0;
    G.forEach((g, gi) => {
      for (let i = 0; i < 8; i++) {
        const n = NAMES[ni++ % NAMES.length];
        db.students.push({ id: FT.uid(), name: n + " " + pick(["الشريف", "منصور", "فوزي", "عبدالحميد", "الجمل", "سالم"]), groupId: g.id, phone: "01" + pick([0, 1, 2, 5]) + Math.floor(10000000 + rnd() * 89999999), parentName: "والد " + n.split(" ")[0], parentPhone: "01" + pick([0, 1, 2, 5]) + Math.floor(10000000 + rnd() * 89999999), notes: "", joined: D.add(today, -90 - Math.floor(rnd() * 60)), archived: false, skill: .45 + rnd() * .5, attend: .6 + rnd() * .4 });
      }
    });
    /* حصص وحضور آخر 8 أسابيع */
    for (let w = 8; w >= 0; w--) {
      G.forEach(g => {
        g.days.forEach(dw => {
          const base = D.weekStart(D.add(today, -w * 7)); const k = (dw + 1) % 7; const date = D.add(base, k);
          if (date > today) return;
          const s = { id: FT.uid(), groupId: g.id, date, topic: pick(["مراجعة الدرس السابق", "حل تدريبات", "شرح درس جديد", "اختبار قصير", "حل نماذج"]) };
          db.sessions.push(s);
          FT.groupStudents(g.id).forEach(st => { const r = rnd(); db.marks.push({ sessionId: s.id, studentId: st.id, s: r < st.attend ? "p" : r < st.attend + .06 ? "l" : r < st.attend + .09 ? "e" : "a" }); });
        });
      });
    }
    /* امتحانات ودرجات */
    G.forEach(g => {
      [["كويز الأسبوع الأول", 15, 40], ["اختبار شهري", 30, 28], ["كويز الجبر", 20, 14], ["اختبار نصف الترم", 50, 5]].forEach(([t, mx, ago]) => {
        const e = { id: FT.uid(), groupId: g.id, title: t, date: D.add(today, -ago), max: mx, type: mx >= 30 ? "اختبار" : "كويز" };
        db.exams.push(e);
        FT.groupStudents(g.id).forEach(st => { if (rnd() < .07) return; db.grades.push({ examId: e.id, studentId: st.id, score: FT.round(Math.max(0, Math.min(mx, mx * (st.skill + (rnd() - .5) * .3))), 1) }); });
      });
      [["واجب المعادلات", 6], ["واجب الهندسة", 3], ["واجب المراجعة", 1]].forEach(([t, ago]) => {
        const h = { id: FT.uid(), groupId: g.id, title: t, date: D.add(today, -ago - 2), due: D.add(today, -ago), desc: "" }; db.homework.push(h);
        FT.groupStudents(g.id).forEach(st => { const r = rnd(); db.hwStatus.push({ hwId: h.id, studentId: st.id, s: r < st.attend * .8 ? "done" : r < st.attend * .8 + .1 ? "late" : r < .93 ? "partial" : "missing" }); });
      });
    });
    /* مدفوعات: آخر 3 شهور */
    const m0 = D.ym(today);
    for (let k = 2; k >= 0; k--) {
      const ym = D.ym(D.addMonths(today, -k));
      db.students.forEach(st => { const g = FT.group(st.groupId); const r = rnd(); if (k === 0 && r > .55) return; if (r < .78 || k > 0) { const part = rnd() < .12; db.payments.push({ id: FT.uid(), studentId: st.id, month: ym, amount: part ? Math.round(g.fee / 2) : g.fee, date: ym + "-" + D.pad(2 + Math.floor(rnd() * 20)), method: pick(["كاش", "كاش", "فودافون كاش", "إنستاباي"]), note: part ? "دفعة أولى" : "" }); } });
      [["إيجار", 1500], ["طباعة وورق", 320], ["مياه ونور", 240], ["أدوات", 150]].forEach(([c, a]) => db.expenses.push({ id: FT.uid(), date: ym + "-" + D.pad(5 + Math.floor(rnd() * 15)), cat: c, amount: a + Math.round(rnd() * 80), note: "" }));
    }
    /* خطة دروس */
    G.forEach((g, gi) => ["الدرس الأول", "الدرس الثاني", "الدرس الثالث", "مراجعة", "اختبار"].forEach((t, i) => db.lessons.push({ id: FT.uid(), groupId: g.id, title: t + " — " + (gi === 0 ? "الجبر" : gi === 1 ? "التفاضل" : "المعادلات"), date: D.add(today, i * 4 - 8), time: g.time, duration: 90, objectives: "فهم المفهوم الأساسي، حل 5 تمارين تطبيقية", activities: "شرح — أمثلة — حل جماعي", homework: "حل تمارين الكتاب", status: i < 2 ? "done" : "planned", notes: "" })));
    /* بنك أسئلة */
    const Q = [
      ["mcq", "ما قيمة ٢ + ٣ × ٤؟", ["١٤", "٢٠", "١٠", "٢٤"], 0, "الجبر", "سهل"], ["mcq", "حل المعادلة س + ٥ = ١٢", ["٥", "٧", "١٧", "٦"], 1, "الجبر", "سهل"],
      ["mcq", "مجموع زوايا المثلث", ["١٨٠°", "٣٦٠°", "٩٠°", "٢٧٠°"], 0, "الهندسة", "سهل"], ["mcq", "مساحة مستطيل طوله ٨ وعرضه ٥", ["١٣", "٤٠", "٢٦", "٤٥"], 1, "الهندسة", "سهل"],
      ["mcq", "الجذر التربيعي للعدد ٨١", ["٧", "٨", "٩", "١١"], 2, "الجبر", "سهل"], ["mcq", "إذا كان ٣س = ٢١ فإن س =", ["٧", "٦", "٨", "١٨"], 0, "الجبر", "متوسط"],
      ["mcq", "محيط دائرة نصف قطرها ٧ (π = ٢٢/٧)", ["٢٢", "٤٤", "١٥٤", "٤٩"], 1, "الهندسة", "متوسط"], ["mcq", "ناتج (س + ٢)(س − ٢)", ["س² − ٤", "س² + ٤", "س² − ٢", "٢س"], 0, "الجبر", "متوسط"],
      ["tf", "كل عدد أولي فردي", ["صح", "خطأ"], 1, "الجبر", "متوسط"], ["tf", "المثلث المتساوي الأضلاع متساوي الزوايا", ["صح", "خطأ"], 0, "الهندسة", "سهل"],
      ["tf", "الصفر عدد موجب", ["صح", "خطأ"], 1, "الجبر", "سهل"], ["mcq", "ميل المستقيم المار بالنقطتين (٠،٠) و(٢،٦)", ["٢", "٣", "٦", "١/٣"], 1, "الهندسة", "متوسط"],
      ["mcq", "قيمة ٢^٥", ["١٠", "٢٥", "٣٢", "١٦"], 2, "الجبر", "سهل"], ["mcq", "حل المتباينة ٢س > ٨", ["س > ٤", "س < ٤", "س > ١٦", "س > ٢"], 0, "الجبر", "صعب"],
      ["mcq", "مساحة مثلث قاعدته ١٠ وارتفاعه ٦", ["٦٠", "٣٠", "١٦", "٢٠"], 1, "الهندسة", "سهل"], ["mcq", "إذا كانت س² = ٦٤ فإن س =", ["٨ فقط", "±٨", "٣٢", "±٣٢"], 1, "الجبر", "صعب"],
      ["essay", "اشرح خطوات حل معادلة من الدرجة الأولى بمجهول واحد مع مثال.", [], -1, "الجبر", "متوسط"], ["essay", "أثبت أن مجموع زوايا المثلث ١٨٠°.", [], -1, "الهندسة", "صعب"]
    ];
    Q.forEach(([t, q, o, a, ch, df]) => db.qbank.push({ id: FT.uid(), type: t, q, opts: o, ans: a, chapter: ch, diff: df, marks: t === "essay" ? 4 : 1, tags: [], used: 0 }));
    /* جدول */
    G.forEach(g => g.days.forEach(d => db.schedule.push({ id: FT.uid(), day: d, start: g.time, end: D.pad(parseInt(g.time) + 2) + ":" + g.time.split(":")[1], title: g.name, place: g.room, color: g.color, groupId: g.id })));
    /* بطاقات */
    db.decks.push({ id: FT.uid(), title: "قوانين الجبر", cards: [["(أ + ب)²", "أ² + ٢أب + ب²"], ["(أ − ب)²", "أ² − ٢أب + ب²"], ["أ² − ب²", "(أ − ب)(أ + ب)"], ["مميز المعادلة التربيعية", "ب² − ٤أج"], ["قانون الجذور", "(−ب ± √المميز) ÷ ٢أ"]].map(([f, b]) => ({ id: FT.uid(), f, b, box: 1, due: today })), created: today });
    FT.resetStates(); FT.save(true);
  };
})();
