/* ===================== الهيكل والتوجيه والإعدادات ===================== */
(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon;

  /* وحدة الإعدادات (موجودة في كل منتج) */
  FT.register({
    id: "settings", title: "الإعدادات", icon: "settings", order: 999,
    render(root) {
      const m = FT.db.meta;
      root.innerHTML = FT.pageHead("الإعدادات", "بياناتك على جهازك بس. خد نسخة احتياطية بشكل دوري.") + `
      <div class="grid g2">
        <div class="card"><div class="card-h"><h3>بيانات المدرس</h3></div>
          <div class="fgrid">
            <div class="f half"><span>الاسم</span><input id="sTeacher" value="${E(m.teacher)}"></div>
            <div class="f half"><span>المادة</span><input id="sSubject" value="${E(m.subject)}"></div>
            <div class="f half"><span>رقم الواتساب</span><input id="sPhone" type="tel" value="${E(m.phone)}" placeholder="01xxxxxxxxx"></div>
            <div class="f half"><span>المدرسة / السنتر</span><input id="sSchool" value="${E(m.school)}"></div>
            <div class="f half"><span>العملة</span><input id="sCur" value="${E(m.currency)}"></div>
            <div class="f half"><span>الشعار</span><input id="sLogo" type="file" accept="image/*"></div>
          </div>
          <div class="row mt"><button class="btn gold" id="sSave">${I("check")} حفظ</button>
          <button class="btn ghost" id="sTheme">${I(m.theme === "dark" ? "sun" : "moon")} ${m.theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</button></div>
        </div>
        <div class="card"><div class="card-h"><h3>النسخ الاحتياطي</h3></div>
          <p class="muted sm mb">كل بياناتك محفوظة في المتصفح. لو مسحت بيانات المتصفح أو غيّرت الجهاز هتحتاج النسخة دي.</p>
          <div class="row"><button class="btn" id="sBack">${I("download")} تحميل نسخة احتياطية</button>
          <label class="btn ghost">${I("upload")} استرجاع نسخة<input type="file" id="sRest" accept=".json" hidden></label></div>
          <div class="divider"></div>
          ${FT.cfg.sharing ? `<div class="f"><span>رابط صفحات المشاركة (الامتحانات / أولياء الأمور / المذاكرة)</span><input id="sRunner" class="ltr" style="width:100%" value="${E(m.runnerBase || FT.cfg.runnerBase)}" placeholder="https://..."><small>بيتحط تلقائيًا في المنتج اللي اشتريته. غيّره بس لو نقلت الصفحات لموقع تاني.</small></div><div class="divider"></div>` : ""}
          <div class="row"><button class="btn dangerg" id="sReset">${I("trash")} مسح كل البيانات</button></div>
        </div>
      </div>
      <p class="muted xs center mt2">${E(FT.cfg.name)} · إصدار ${E(FT.cfg.version || "1.0")} · من FASL TECH</p>`;
      const $ = s => FT.$(s, root);
      $("#sSave").onclick = () => { m.teacher = $("#sTeacher").value.trim(); m.subject = $("#sSubject").value.trim(); m.phone = $("#sPhone").value.trim(); m.school = $("#sSchool").value.trim(); m.currency = $("#sCur").value.trim() || "ج.م"; const r = $("#sRunner"); if (r) m.runnerBase = r.value.trim(); FT.save(true); FT.toast("تم الحفظ", "ok"); FT.shell(); };
      $("#sTheme").onclick = () => { m.theme = m.theme === "dark" ? "light" : "dark"; FT.save(true); FT.applyTheme(); FT.refresh(); };
      $("#sLogo").onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement("canvas"), s = 160, k = Math.min(1, s / Math.max(img.width, img.height)); c.width = img.width * k; c.height = img.height * k; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); m.logo = c.toDataURL("image/png"); FT.save(true); FT.shell(); FT.toast("تم تغيير الشعار", "ok"); }; img.src = rd.result; }; rd.readAsDataURL(f); };
      $("#sBack").onclick = () => FT.backup();
      $("#sRest").onchange = async e => { if (!e.target.files[0]) return; if (!await FT.confirm("الاسترجاع هيستبدل كل البيانات الحالية. متأكد؟", "استرجع")) return; try { await FT.restore(e.target.files[0]); FT.toast("تم الاسترجاع", "ok"); FT.shell(); } catch (er) { FT.toast(er.message, "bad"); } };
      $("#sReset").onclick = async () => { if (await FT.confirm("هيتمسح كل حاجة نهائيًا. خد نسخة احتياطية الأول. متأكد؟", "امسح كل حاجة")) { FT.db = FT.blank(); FT.resetStates(); FT.save(true); FT.toast("تم المسح"); FT.shell(); } };
    }
  });

  /* ---------- الهيكل ---------- */
  FT.shell = function () {
    const ids = FT.cfg.modules.concat(["settings"]);
    FT.active = ids.map(id => FT.modules.find(m => m.id === id)).filter(Boolean);
    const m = FT.db.meta;
    document.title = FT.cfg.name + " | FASL TECH";
    const logo = m.logo ? `<img src="${m.logo}" alt="">` : FT.logoSvg;
    const nav = FT.active.map((x, i) => {
      const b = x.badge ? x.badge() : 0;
      return `${x.sepBefore ? '<div class="sep"></div>' : ""}${x.id === "settings" ? '<div class="sep"></div>' : ""}<a href="#/${x.id}" data-id="${x.id}">${I(x.icon)}<span>${E(x.title)}</span>${b ? `<span class="cnt">${b}</span>` : ""}</a>`;
    }).join("");
    document.body.innerHTML = `
    <div class="topbar no-print"><button class="icon-btn" id="burger" aria-label="القائمة">${I("menu")}</button><b>${E(FT.cfg.name)}</b></div>
    <div class="scrim" id="scrim"></div>
    <div class="app">
      <aside class="side no-print" id="side">
        <div class="brand"><div class="logo">${logo}</div><div><b>${E(m.teacher || FT.cfg.name)}</b><small>${E(m.teacher ? FT.cfg.name : "FASL TECH")}</small></div></div>
        <nav class="nav" aria-label="التنقل">${nav}</nav>
        <div class="side-foot">بياناتك محفوظة على جهازك<br><b>FASL TECH</b></div>
      </aside>
      <main class="main"><div class="view" id="view"></div></main>
    </div>`;
    const side = FT.$("#side"), scrim = FT.$("#scrim");
    const tog = o => { side.classList.toggle("open", o); scrim.classList.toggle("open", o); };
    FT.$("#burger").onclick = () => tog(true); scrim.onclick = () => tog(false);
    FT.$$(".nav a").forEach(a => a.onclick = () => tog(false));
    FT.route();
  };
  FT.route = function () {
    const id = (location.hash.replace(/^#\//, "").split("?")[0]) || FT.active[0].id;
    const mod = FT.active.find(x => x.id === id) || FT.active[0];
    FT.$$(".nav a").forEach(a => a.classList.toggle("on", a.dataset.id === mod.id));
    let view = FT.$("#view"); if (!view) return;
    const fresh = view.cloneNode(false); view.replaceWith(fresh); view = fresh; // عنصر جديد في كل رسم علشان مستمعات الأحداث القديمة متتراكمش
    try { mod.render(view, { go: FT.go, refresh: FT.refresh }); }
    catch (e) { console.error(e); view.innerHTML = `<div class="note bad">${I("alert")}<div>حصل خطأ في عرض الصفحة: ${E(e.message)}. جرّب تحميل نسخة احتياطية وإعادة فتح الصفحة.</div></div>`; }
    window.scrollTo(0, 0);
  };

  /* ---------- الترحيب ---------- */
  function welcome() {
    const m = FT.db.meta;
    const w = FT.modal("أهلًا بيك في " + FT.cfg.name, `
      <p class="muted mb">${E(FT.cfg.tagline || "")}</p>
      <div class="fgrid">
        <div class="f half"><span>اسمك</span><input id="wName" placeholder="مثلًا: أ/ أحمد محمود"></div>
        <div class="f half"><span>المادة</span><input id="wSub" placeholder="مثلًا: رياضيات"></div>
      </div>
      <div class="note mt">${I("shield")}<div>كل بياناتك بتتحفظ على جهازك أنت بس، ومحدش غيرك يقدر يشوفها.</div></div>`, { sticky: true, noFocus: false, buttons: [
      { label: "ابدأ", cls: "gold", onClick: () => { m.teacher = FT.$("#wName").value.trim() || "مدرس"; m.subject = FT.$("#wSub").value.trim(); FT.save(true); FT.shell(); } },
      { label: "جرّب ببيانات تجريبية", cls: "ghost", onClick: () => { m.teacher = FT.$("#wName").value.trim() || "أ/ أحمد محمود"; m.subject = FT.$("#wSub").value.trim() || "رياضيات"; FT.demo(); FT.save(true); FT.shell(); } }] });
    FT.$(".m-head [data-close]", w.el).style.display = "none";
  }
  window.addEventListener("hashchange", () => FT.active && FT.route());
  document.addEventListener("DOMContentLoaded", () => {
    FT.load();
    FT.shell();
    if (!FT.db.meta.teacher) welcome();
  });
})();
