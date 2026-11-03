/* ===================== تسجيل الطلاب (رابط + QR + واتساب + يدوي) ===================== */
(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon, D = FT.date;
  const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const dec = s => { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return JSON.parse(decodeURIComponent(escape(atob(s)))); };
  const link = () => { const m = FT.db.meta; let b = (m.joinBase || "").trim(); if (!b) return ""; if (!b.endsWith("/")) b += "/"; return b + "join.html#" + enc({ n: m.teacher, s: m.subject, w: FT.phoneEG(m.phone), g: FT.db.groups.map(g => [g.id, g.name]) }); };
  const qr = (u, z = 300) => `https://api.qrserver.com/v1/create-qr-code/?size=${z}x${z}&margin=6&data=${encodeURIComponent(u)}`;

  FT.register({
    id: "join", title: "تسجيل الطلاب", icon: "qr", order: 9,
    render(root) {
      const m = FT.db.meta, u = link();
      root.innerHTML = FT.pageHead("تسجيل الطلاب", "انشر مجلد البرنامج على الإنترنت، ثم ضع رابطه هنا لتوليد QR صالح للطلاب.") + `<div class="grid g2">
        <div class="card"><div class="card-h"><h3>١) رابط وباركود التسجيل</h3></div>
          <div class="note mb"><div><b>قبل توليد الباركود:</b><br>١) انشر مجلد البرنامج كاملًا على الإنترنت (GitHub Pages أو Netlify).<br>٢) من «الإعدادات» أضف اسم المدرس ورقم واتساب صحيحًا.<br>٣) ضع رابط المجلد المنشور أدناه — وليس رابط <code>join.html</code> — ثم اضغط «حفظ وتوليد». رابط الملف المحلي <code>file://</code> لا يعمل عند الطلاب.</div></div><div class="f"><span>رابط المجلد المنشور على الإنترنت</span><input id="jB" class="ltr" value="${E(m.joinBase || "")}" placeholder="https://اسمك.github.io/certificate-designer/"><small>مثال: https://username.github.io/certificate-designer/</small></div>
          <div class="row mt"><button class="btn gold" id="jS">${I("check")} حفظ وتوليد</button></div>
          ${u ? `<div class="center mt"><img src="${qr(u)}" alt="باركود QR لفتح نموذج تسجيل الطالب" width="220" height="220" style="border-radius:12px;background:#fff;padding:6px"><p class="muted sm">الطالب يمسحه لفتح نموذج التسجيل على موقعك</p></div><div class="row mt" style="justify-content:center"><a class="btn ghost sm" href="${E(u)}" target="_blank" rel="noopener">فتح نموذج الطالب للتجربة</a><button class="btn ghost sm" id="jC">${I("copy")} نسخ الرابط</button><button class="btn wa sm" id="jW">${I("whatsapp")} إرسال للطلاب</button><button class="btn ghost sm" id="jP">${I("print")} ورقة للطباعة</button></div>` : `<p class="muted sm mt">أدخل رابط موقعك المنشور بالأعلى؛ بعدها سيظهر الباركود هنا. يلزم اتصال إنترنت لعرض صورة QR.</p>`}
        </div>
        <div class="card"><div class="card-h"><h3>٢) استلام التسجيلات</h3></div>
          <p class="muted sm mb">الطالب بيبعتلك رسالة واتساب فيها بياناته. انسخ الرسائل (واحدة أو كلها) والصقها هنا.</p>
          <textarea id="jT" rows="6" placeholder="الصق رسائل الطلاب هنا"></textarea><div class="row mt"><button class="btn gold" id="jI">${I("download")} استيراد الطلاب</button></div>
          <div class="divider"></div><div class="card-h"><h3>٣) تسجيل يدوي سريع</h3></div><p class="muted sm mb">للي معهوش موبايل. بعد كل حفظ الخانة بتتفضى علشان اللي بعده.</p>
          ${FT.db.groups.length ? `<div class="fgrid"><div class="f"><span>الاسم</span><input id="qN"></div><div class="f half"><span>المجموعة</span><select id="qG">${FT.db.groups.map(g => `<option value="${g.id}">${E(g.name)}</option>`).join("")}</select></div><div class="f half"><span>موبايل ولي الأمر</span><input id="qP" type="tel"></div></div><div class="row mt"><button class="btn" id="qA">${I("plus")} إضافة</button><span class="muted sm" id="qC"></span></div>` : `<p class="muted sm">ضيف مجموعة الأول من صفحة المجموعات.</p>`}
        </div></div>`;
      const $ = s => FT.$(s, root);
      $("#jS").onclick = () => {
        const base = $("#jB").value.trim();
        if (!/^https?:\/\//i.test(base)) return FT.toast("ضع رابط موقع منشور يبدأ بـ https:// — رابط file:// لا يعمل للطلاب", "bad");
        if (!m.teacher || !m.phone) return FT.toast("أضف اسم المدرس ورقم واتساب من الإعدادات أولًا", "bad");
        m.joinBase = base; FT.save(true); FT.refresh();
      };
      if (u) {
        $("#jC").onclick = () => FT.copy(u, "تم نسخ الرابط");
        $("#jW").onclick = () => FT.wa("", `سجّل بياناتك مع ${m.teacher || "المدرس"} من الرابط ده:\n${u}`);
        $("#jP").onclick = () => FT.printHTML(`<div style="text-align:center;padding-top:25mm"><h1 style="font-size:34pt">سجّل بياناتك</h1><p style="font-size:18pt">${E(m.teacher || "")} — ${E(m.subject || "")}</p><img src="${qr(u, 600)}" style="width:110mm;margin:12mm 0"><p style="font-size:16pt">صوّر الباركود بكاميرا الموبايل واملا بياناتك</p></div>`, "ورقة التسجيل");
      }
      $("#jI").onclick = () => {
        const t = $("#jT").value, gs = FT.db.groups; let n = 0;
        if (!gs.length) return FT.toast("ضيف مجموعة الأول", "bad");
        for (const x of t.matchAll(/FTJ:([A-Za-z0-9_-]+)/g)) {
          let d; try { d = dec(x[1]); } catch (e) { continue; }
          if (!d.n) continue; const g = gs.find(z => z.id === d.g) || gs[0];
          if (FT.db.students.some(s => s.name === d.n && s.groupId === g.id)) continue;
          FT.db.students.push({ id: FT.uid(), name: d.n, groupId: g.id, phone: d.p || "", parentName: d.pn || "", parentPhone: d.pp || "", notes: "", joined: D.today(), archived: false }); n++;
        }
        if (!n) return FT.toast("مفيش تسجيلات جديدة في النص", "bad");
        FT.save(true); FT.toast(`تمت إضافة ${n} طالب`, "ok"); FT.refresh();
      };
      const qa = $("#qA"); if (qa) { let c = 0; qa.onclick = () => { const nm = $("#qN").value.trim(); if (!nm) return FT.toast("اكتب الاسم", "bad"); FT.db.students.push({ id: FT.uid(), name: nm, groupId: $("#qG").value, phone: "", parentName: "", parentPhone: $("#qP").value.trim(), notes: "", joined: D.today(), archived: false }); FT.save(true); c++; $("#qN").value = ""; $("#qP").value = ""; $("#qN").focus(); $("#qC").textContent = `تمت إضافة ${c}`; }; }
    }
  });
})();
