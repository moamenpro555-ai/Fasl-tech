/* ===================== الطلاب + المجموعات + ملف الطالب ===================== */
(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon, D = FT.date, S = FT.stats;

  /* ---------- ملف الطالب 360° ---------- */
  FT.studentProfile = function (sid) {
    const s = FT.student(sid); if (!s) return;
    const g = FT.group(s.groupId) || { name: "—" };
    const att = S.att(sid), grs = S.grades(sid), avg = S.avgGrade(sid), hw = S.hw(sid), risk = S.risk(sid), arrears = S.arrears(sid);
    const sessions = FT.db.sessions.filter(x => x.groupId === s.groupId).sort((a, b) => a.date.localeCompare(b.date)).slice(-24);
    const mk = Object.fromEntries(S.marksOf(sid).map(m => [m.sessionId, m.s]));
    const heat = FT.charts.heat(sessions.map(x => ({ t: D.fmt(x.date) + " — " + ({ p: "حاضر", a: "غايب", l: "متأخر", e: "بعذر" }[mk[x.id]] || "—"), s: mk[x.id] })));
    const html = `
      <div class="row" style="gap:16px;align-items:flex-start">
        ${FT.avatar(s.name, "lg")}
        <div class="grow"><div class="h2" style="margin:0">${E(s.name)}</div><div class="muted sm">${E(g.name)} ${S.riskBadge(risk)}</div>
        ${risk.why.length ? `<div class="sm mt" style="margin-top:6px;color:var(--warn)">${I("alert")} ${E(risk.why.join(" · "))}</div>` : ""}</div>
        <div class="row no-print"><button class="btn wa sm" id="pWa">${I("whatsapp")} ولي الأمر</button><button class="btn ghost sm" id="pEdit">${I("edit")} تعديل</button></div>
      </div>
      <div class="grid g4 mt">
        ${FT.kpi("الحضور", att.rate == null ? "—" : att.rate + "%", `${att.p} حضور · ${att.a} غياب`, att.rate >= 85 ? "ok" : att.rate >= 70 ? "warn" : "bad")}
        ${FT.kpi("متوسط الدرجات", avg == null ? "—" : avg + "%", S.gradeLabel(avg), S.gradeCls(avg) || "info")}
        ${FT.kpi("الواجبات", hw.rate == null ? "—" : hw.rate + "%", `${hw.done} من ${hw.total} اتسلّم`, hw.rate >= 80 ? "ok" : "warn")}
        ${FT.kpi("المتأخرات", FT.money(arrears), arrears ? "عليه مستحقات" : "مسدد", arrears ? "bad" : "ok")}
      </div>
      <div class="grid g2 mt">
        <div class="card flat"><div class="h3">تطوّر الدرجات</div>${grs.length > 1 ? FT.charts.line(grs.map(x => ({ l: D.short(x.exam.date), v: Math.round(x.pct) })), { max: 100, unit: "%", h: 190 }) : `<p class="muted sm">محتاج امتحانين على الأقل علشان يظهر الرسم.</p>`}</div>
        <div class="card flat"><div class="h3">آخر ${sessions.length} حصة</div>${heat}<div class="legend mt"><span><i style="background:var(--ok)"></i>حاضر</span><span><i style="background:var(--bad)"></i>غايب</span><span><i style="background:var(--warn)"></i>متأخر</span><span><i style="background:var(--info)"></i>بعذر</span></div>
        <div class="h3" style="margin-top:16px">الدرجات</div>${grs.slice(-5).reverse().map(x => `<div class="row between sm" style="padding:3px 0"><span>${E(x.exam.title)}</span><b>${FT.round(x.score, 1)} / ${x.exam.max} <span class="badge ${S.gradeCls(x.pct)}">${Math.round(x.pct)}%</span></b></div>`).join("") || `<p class="muted sm">لا توجد درجات.</p>`}</div>
      </div>
      <div class="note mt" style="background:var(--bg);color:var(--text)">${I("info")}<div><b>ملاحظات:</b> ${E(s.notes || "لا توجد ملاحظات") }</div></div>`;
    const m = FT.modal("ملف الطالب", html, { size: "lg", buttons: [{ label: "طباعة تقرير الطالب", cls: "ghost", close: false, onClick: () => FT.printStudentReport && FT.printStudentReport(sid) }, { label: "إغلاق", cls: "ghost" }] });
    FT.$("#pWa", m.el).onclick = () => FT.wa(s.parentPhone || s.phone, FT.studentMsg(sid));
    FT.$("#pEdit", m.el).onclick = () => { m.close(); editStudent(s); };
  };
  /* رسالة جاهزة لولي الأمر */
  FT.studentMsg = sid => {
    const s = FT.student(sid), att = S.att(sid), avg = S.avgGrade(sid), hw = S.hw(sid), ar = S.arrears(sid), t = FT.db.meta;
    return `السلام عليكم ${s.parentName || "ولي أمر الطالب"} 🌷\nتقرير ${s.name} مع ${t.teacher || "المدرس"}${t.subject ? " (" + t.subject + ")" : ""}:\n• الحضور: ${att.rate == null ? "—" : att.rate + "%"} (غياب ${att.a})\n• متوسط الدرجات: ${avg == null ? "—" : avg + "%"}\n• الواجبات: ${hw.rate == null ? "—" : hw.rate + "%"}${ar > 0 ? "\n• المتبقي من المصروفات: " + FT.money(ar) : ""}\nشكرًا لتعاونكم.`;
  };
  FT.printStudentReport = sid => {
    const s = FT.student(sid), att = S.att(sid), grs = S.grades(sid), hw = S.hw(sid), avg = S.avgGrade(sid), g = FT.group(s.groupId) || {};
    FT.printHTML(`<div class="pg">${FT.printHeader("تقرير الطالب: " + s.name, (g.name || "") + " — " + D.fmt(D.today()))}
      <table><tr><th>الحضور</th><th>متوسط الدرجات</th><th>الواجبات</th><th>حصص الغياب</th></tr><tr class="c"><td>${att.rate == null ? "—" : att.rate + "%"}</td><td>${avg == null ? "—" : avg + "%"}</td><td>${hw.rate == null ? "—" : hw.rate + "%"}</td><td>${att.a}</td></tr></table>
      <h3 style="margin-top:14px">الدرجات</h3><table><tr><th>الاختبار</th><th>التاريخ</th><th>الدرجة</th><th>النسبة</th></tr>${grs.map(x => `<tr><td>${E(x.exam.title)}</td><td>${D.fmt(x.exam.date)}</td><td>${FT.round(x.score, 1)} / ${x.exam.max}</td><td>${Math.round(x.pct)}%</td></tr>`).join("") || `<tr><td colspan="4" class="c muted">لا توجد درجات</td></tr>`}</table>
      <p class="muted" style="margin-top:20px">توقيع المدرس: ____________________</p></div>`, "تقرير " + s.name);
  };

  function editStudent(s) {
    const isNew = !s; s = s || { name: "", groupId: FT.db.groups[0] && FT.db.groups[0].id, phone: "", parentName: "", parentPhone: "", notes: "", fee: "", joined: D.today() };
    FT.form(isNew ? "إضافة طالب" : "تعديل بيانات الطالب", [
      { k: "name", label: "اسم الطالب", value: s.name, req: true },
      { k: "groupId", label: "المجموعة", type: "select", value: s.groupId, options: FT.db.groups.map(g => [g.id, g.name]), half: true },
      { k: "joined", label: "تاريخ الانضمام", type: "date", value: s.joined, half: true },
      { k: "phone", label: "موبايل الطالب", type: "tel", value: s.phone, half: true },
      { k: "parentPhone", label: "موبايل ولي الأمر", type: "tel", value: s.parentPhone, half: true },
      { k: "parentName", label: "اسم ولي الأمر", value: s.parentName, half: true },
      { k: "fee", label: "مصروفات خاصة (اختياري)", type: "number", value: s.fee, half: true, hint: "سيبها فاضية لو نفس سعر المجموعة" },
      { k: "notes", label: "ملاحظات", type: "textarea", value: s.notes }
    ], d => {
      if (!FT.db.groups.length) { FT.toast("ضيف مجموعة الأول", "bad"); return false; }
      if (isNew) FT.db.students.push(Object.assign({ id: FT.uid(), archived: false }, d)); else Object.assign(s, d);
      FT.save(); FT.toast(isNew ? "تمت إضافة الطالب" : "تم الحفظ", "ok"); FT.refresh();
    });
  }
  FT.editStudent = editStudent;

  function importStudents() {
    const m = FT.modal("استيراد طلاب", `<p class="muted sm mb">الصق الأسماء (اسم في كل سطر) أو من إكسيل بالترتيب: <b>الاسم، موبايل الطالب، موبايل ولي الأمر</b>. أو اختار ملف CSV.</p>
      <div class="f mb"><span>المجموعة</span><select id="imG">${FT.db.groups.map(g => `<option value="${g.id}">${E(g.name)}</option>`).join("")}</select></div>
      <textarea id="imT" rows="8" placeholder="أحمد محمد	01012345678	01198765432"></textarea><div class="row mt"><input type="file" id="imF" accept=".csv,.txt" style="max-width:260px"></div>`, { size: "lg", buttons: [{ label: "استيراد", cls: "gold", onClick: () => {
      const rows = FT.parseCSV(FT.$("#imT", m.el).value); let n = 0; const gid = FT.$("#imG", m.el).value;
      rows.forEach(r => { const name = (r[0] || "").trim(); if (!name || /^(الاسم|name)$/i.test(name)) return; FT.db.students.push({ id: FT.uid(), name, groupId: gid, phone: (r[1] || "").trim(), parentPhone: (r[2] || "").trim(), parentName: "", notes: "", joined: D.today(), archived: false }); n++; });
      if (!n) { FT.toast("مفيش أسماء صالحة", "bad"); return false; } FT.save(); FT.toast(`تم استيراد ${n} طالب`, "ok"); FT.refresh();
    } }, { label: "إلغاء", cls: "ghost" }] });
    FT.$("#imF", m.el).onchange = e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = () => FT.$("#imT", m.el).value = r.result; r.readAsText(f); } };
  }

  FT.register({
    id: "students", title: "الطلاب", icon: "users", order: 10,
    render(root) {
      if (!FT.db.groups.length) { root.innerHTML = FT.pageHead("الطلاب", "") + `<div class="card">${FT.empty("users", "ابدأ بإضافة أول مجموعة", "قسّم طلابك لمجموعات (حسب الصف أو الميعاد) وبعدها ضيف الطلاب.", `<button class="btn gold" id="g1">${I("plus")} إضافة مجموعة</button>`)}</div>`; FT.$("#g1", root).onclick = () => FT.editGroup(); return; }
      const st = { q: "", g: "all", arch: false };
      const draw = () => {
        let list = FT.db.students.filter(s => !!s.archived === st.arch && (st.g === "all" || s.groupId === st.g) && (!st.q || (s.name + s.phone + s.parentPhone).includes(st.q)));
        list.sort((a, b) => FT.sortAr(a.name, b.name));
        FT.$("#stBody", root).innerHTML = list.length ? list.map(s => { const a = S.att(s.id), av = S.avgGrade(s.id), r = S.risk(s.id), ar = S.arrears(s.id); return `<tr data-id="${s.id}">
          <td><div class="who">${FT.avatar(s.name)}<span>${E(s.name)}</span></div></td><td>${E((FT.group(s.groupId) || {}).name || "—")}</td>
          <td class="num">${a.rate == null ? "—" : `<span class="badge ${a.rate >= 85 ? "ok" : a.rate >= 70 ? "warn" : "bad"}">${a.rate}%</span>`}</td>
          <td class="num">${av == null ? "—" : `<span class="badge ${S.gradeCls(av)}">${av}%</span>`}</td>
          <td class="num">${ar ? `<span class="badge bad">${FT.money(ar)}</span>` : `<span class="badge ok">مسدد</span>`}</td>
          <td>${S.riskBadge(r)}</td>
          <td class="no-print"><button class="icon-btn" data-a="open" title="ملف الطالب">${I("user")}</button><button class="icon-btn" data-a="edit" title="تعديل">${I("edit")}</button><button class="icon-btn" data-a="arch" title="${st.arch ? "استرجاع" : "أرشفة"}">${I(st.arch ? "refresh" : "folder")}</button><button class="icon-btn bad" data-a="del" title="حذف">${I("trash")}</button></td></tr>`; }).join("")
          : `<tr><td colspan="7">${FT.empty("search", "مفيش طلاب مطابقين", "غيّر البحث أو ضيف طالب جديد.")}</td></tr>`;
        FT.$("#stCount", root).textContent = list.length + " طالب";
      };
      root.innerHTML = FT.pageHead("الطلاب", "ملف كامل لكل طالب: حضور ودرجات وواجبات ومصروفات.", `<button class="btn ghost" id="stImp">${I("upload")} استيراد</button><button class="btn ghost" id="stCsv">${I("download")} تصدير</button><button class="btn gold" id="stAdd">${I("plus")} طالب جديد</button>`) + `
        <div class="toolbar"><div class="search">${I("search")}<input id="stQ" type="search" placeholder="ابحث بالاسم أو الرقم"></div>
        <select id="stG" style="width:auto"><option value="all">كل المجموعات</option>${FT.db.groups.map(g => `<option value="${g.id}">${E(g.name)}</option>`).join("")}</select>
        <div class="seg"><button class="on" data-arch="0">الحاليين</button><button data-arch="1">الأرشيف</button></div><span class="muted sm" id="stCount"></span></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>الطالب</th><th>المجموعة</th><th class="num">الحضور</th><th class="num">الدرجات</th><th class="num">المتأخرات</th><th>الحالة</th><th></th></tr></thead><tbody id="stBody"></tbody></table></div>`;
      draw();
      FT.$("#stQ", root).oninput = FT.debounce(e => { st.q = FT.toEn(e.target.value.trim()); draw(); }, 150);
      FT.$("#stG", root).onchange = e => { st.g = e.target.value; draw(); };
      FT.$$("[data-arch]", root).forEach(b => b.onclick = () => { st.arch = b.dataset.arch === "1"; FT.$$("[data-arch]", root).forEach(x => x.classList.toggle("on", x === b)); draw(); });
      FT.$("#stAdd", root).onclick = () => editStudent();
      FT.$("#stImp", root).onclick = importStudents;
      FT.$("#stCsv", root).onclick = () => FT.csv([["الاسم", "المجموعة", "موبايل الطالب", "موبايل ولي الأمر", "الحضور%", "متوسط الدرجات%", "المتأخرات"]].concat(FT.db.students.filter(s => !s.archived).map(s => [s.name, (FT.group(s.groupId) || {}).name, s.phone, s.parentPhone, S.att(s.id).rate, S.avgGrade(s.id), S.arrears(s.id)])), "students.csv");
      FT.on(FT.$("#stBody", root), "click", "[data-a],tr[data-id]", async (e, el) => {
        const tr = el.closest("tr"), id = tr.dataset.id, s = FT.student(id), a = el.dataset.a;
        if (!a || a === "open") return FT.studentProfile(id);
        if (a === "edit") editStudent(s);
        if (a === "arch") { s.archived = !s.archived; FT.save(); FT.refresh(); }
        if (a === "del" && await FT.confirm(`حذف ${s.name} وكل بياناته (حضور ودرجات ومدفوعات)؟`, "احذف")) {
          const db = FT.db; db.students = db.students.filter(x => x.id !== id); db.marks = db.marks.filter(x => x.studentId !== id); db.grades = db.grades.filter(x => x.studentId !== id); db.hwStatus = db.hwStatus.filter(x => x.studentId !== id); db.payments = db.payments.filter(x => x.studentId !== id); FT.save(); FT.refresh();
        }
      });
    }
  });

  /* ---------- المجموعات ---------- */
  FT.editGroup = function (g) {
    const isNew = !g; g = g || { name: "", grade: "", fee: "", days: [], time: "16:00", room: "", color: FT.COLORS[FT.db.groups.length % FT.COLORS.length] };
    FT.form(isNew ? "مجموعة جديدة" : "تعديل المجموعة", [
      { k: "name", label: "اسم المجموعة", value: g.name, req: true, placeholder: "مثلًا: تالتة إعدادي — السبت" },
      { k: "grade", label: "الصف", value: g.grade, half: true }, { k: "fee", label: "المصروفات الشهرية", type: "number", value: g.fee, half: true, req: true },
      { k: "days", label: "أيام الحصص", type: "checks", value: g.days, options: D.days.map((d, i) => [i, d]) },
      { k: "time", label: "الميعاد", type: "time", value: g.time, half: true }, { k: "room", label: "المكان", value: g.room, half: true },
      { k: "color", label: "اللون", type: "color", value: g.color }
    ], d => {
      d.days = d.days.map(Number);
      if (isNew) FT.db.groups.push(Object.assign({ id: FT.uid() }, d)); else Object.assign(g, d);
      FT.save(); FT.toast("تم الحفظ", "ok"); FT.refresh();
    });
  };
  FT.register({
    id: "groups", title: "المجموعات", icon: "layers", order: 11,
    render(root) {
      root.innerHTML = FT.pageHead("المجموعات", "نظّم طلابك حسب الصف أو الميعاد.", `<button class="btn gold" id="gAdd">${I("plus")} مجموعة جديدة</button>`) + (FT.db.groups.length ? `<div class="grid g-auto">${FT.db.groups.map(g => {
        const n = FT.groupStudents(g.id).length, ar = FT.sum(FT.groupStudents(g.id).map(s => S.arrears(s.id))), at = S.groupAtt(g.id);
        return `<div class="card" style="border-top:5px solid ${g.color}"><div class="card-h"><h3>${E(g.name)}</h3><div class="row" style="gap:0"><button class="icon-btn" data-e="${g.id}">${I("edit")}</button><button class="icon-btn bad" data-d="${g.id}">${I("trash")}</button></div></div>
        <div class="muted sm">${E(g.grade || "")} ${g.days.length ? "· " + g.days.map(d => D.days[d]).join(" و") : ""} ${g.time ? "· " + D.time12(g.time) : ""}</div>
        <div class="grid g3 mt" style="gap:8px"><div class="center"><div class="b" style="font-size:1.4rem">${n}</div><div class="xs muted">طالب</div></div><div class="center"><div class="b" style="font-size:1.4rem">${at == null ? "—" : at + "%"}</div><div class="xs muted">حضور</div></div><div class="center"><div class="b" style="font-size:1.4rem;color:${ar ? "var(--bad)" : "var(--ok)"}">${FT.fmt(ar)}</div><div class="xs muted">متأخرات</div></div></div>
        <div class="muted sm mt">المصروفات: <b>${FT.money(g.fee)}</b> / شهر</div></div>`; }).join("")}</div>` : `<div class="card">${FT.empty("layers", "لسه مفيش مجموعات", "أنشئ أول مجموعة وابدأ تضيف طلابك.", "")}</div>`);
      FT.$("#gAdd", root).onclick = () => FT.editGroup();
      FT.on(root, "click", "[data-e]", (e, el) => FT.editGroup(FT.group(el.dataset.e)));
      FT.on(root, "click", "[data-d]", async (e, el) => { const g = FT.group(el.dataset.d); if (FT.groupStudents(g.id).length) return FT.toast("انقل الطلاب لمجموعة تانية الأول", "bad"); if (await FT.confirm("حذف المجموعة " + g.name + "؟")) { FT.db.groups = FT.db.groups.filter(x => x.id !== g.id); FT.save(); FT.refresh(); } });
    }
  });
})();
