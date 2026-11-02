/* ===== لوحة تحكم الأدمن (متصلة بالـ API) =====
   الدخول بحساب الأدمن (ADMIN_EMAIL / ADMIN_PASSWORD من إعدادات Render).
   الحماية الحقيقية في السيرفر: أي طلب من غير أدمن بيترفض. */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("adminRoot");
  const user = getUser();

  if (!getToken() || !user || user.role !== "admin") {
    root.innerHTML = `<div class="auth-box" style="margin-top:0"><h3 style="margin-bottom:14px">دخول الأدمن</h3>
      <div class="form-row"><label>البريد الإلكتروني</label><input type="email" id="aEmail"></div>
      <div class="form-row"><label>كلمة المرور</label><input type="password" id="aPass"></div>
      <button class="btn btn-gold btn-block" id="aBtn">دخول</button></div>`;
    document.getElementById("aBtn").onclick = async () => {
      try {
        const data = await api("/api/auth/login", { method: "POST", body: {
          email: document.getElementById("aEmail").value.trim(), password: document.getElementById("aPass").value } });
        if (data.user.role !== "admin") { toast("هذا الحساب ليس أدمن"); return; }
        saveSession(data); location.reload();
      } catch (e) { toast(e.message); }
    };
    return;
  }
  renderAdmin();
});

async function renderAdmin() {
  const root = document.getElementById("adminRoot");
  showLoading(root);
  let stats, products, orders, customers, coupons;
  try {
    [stats, products, orders, customers, coupons] = await Promise.all([
      api("/api/admin/stats"), api("/api/admin/products"), api("/api/admin/orders"),
      api("/api/admin/customers"), api("/api/admin/coupons")
    ]);
  } catch (e) { showError(root, e); return; }

  root.innerHTML = `
    <div class="stats">
      <div class="stat"><b>${stats.revenue} جنيه</b><span>الإيرادات</span></div>
      <div class="stat"><b>${stats.orders}</b><span>الطلبات</span></div>
      <div class="stat"><b>${stats.customers}</b><span>العملاء</span></div>
      <div class="stat"><b>${stats.refunded} جنيه</b><span>المبالغ المستردة</span></div>
    </div>

    <div class="panel" style="margin-bottom:20px">
      <h3>إدارة المنتجات</h3>
      <div class="inline-form">
        <input type="text" id="nName" placeholder="اسم المنتج">
        <input type="number" id="nPrice" placeholder="السعر (0 = مجاني)">
        <input type="number" id="nOld" placeholder="السعر قبل الخصم (اختياري)">
        <select id="nCat" style="width:100%">${CATEGORIES.map(c => `<option value="${c.key}">${c.name}</option>`).join("")}</select>
        <input type="text" id="nDesc" placeholder="وصف قصير">
        <button class="btn btn-gold" id="addProd">+ إضافة منتج</button>
      </div>
      <div class="table-wrap"><table>
        <tr><th>المنتج</th><th>التصنيف</th><th>السعر</th><th>المبيعات</th><th>الملف</th><th>النشر</th><th></th></tr>
        ${products.map(p => `<tr>
          <td>${p.icon} ${esc(p.name)}</td><td>${catName(p.cat)}</td><td>${money(p.price)}</td><td>${p.sales}</td>
          <td>${p.hasFile ? "✔ مرفوع" : "❌ لا يوجد"}
            <label class="btn btn-outline btn-sm" style="margin-inline-start:6px">رفع
              <input type="file" hidden onchange="uploadFile(${p.id}, this)"></label></td>
          <td><button class="btn btn-outline btn-sm" onclick="togglePublish(${p.id}, ${!p.published})">${p.published ? "منشور ✔" : "مسودة"}</button></td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">حذف</button></td>
        </tr>`).join("")}
      </table></div>
    </div>

    <div class="panel" style="margin-bottom:20px">
      <h3>إدارة الطلبات</h3>
      ${orders.length ? `<div class="table-wrap"><table>
        <tr><th>رقم الطلب</th><th>العميل</th><th>الإجمالي</th><th>الدفع</th><th>التاريخ</th><th>الحالة</th></tr>
        ${orders.map(o => `<tr>
          <td>${o.id}</td><td>${esc(o.email)}</td><td>${o.total} جنيه</td><td>${PAY_METHODS[o.method] || o.method}</td><td>${fmtDate(o.created_at)}</td>
          <td><select onchange="setOrderStatus('${o.id}', this.value)">
            ${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === o.status ? "selected" : ""}>${v[0]}</option>`).join("")}
          </select></td></tr>`).join("")}
      </table></div>` : `<div class="empty">لا توجد طلبات.</div>`}
    </div>

    <div class="panel" style="margin-bottom:20px">
      <h3>الكوبونات</h3>
      <div class="inline-form">
        <input type="text" id="cCode" placeholder="الكود (مثل RAMADAN15)">
        <input type="number" id="cPercent" placeholder="نسبة الخصم %">
        <button class="btn btn-gold" id="addCoupon">+ إضافة كوبون</button>
      </div>
      <div class="table-wrap"><table>
        <tr><th>الكود</th><th>الخصم</th><th>الحالة</th><th></th></tr>
        ${coupons.map(c => `<tr><td>${esc(c.code)}</td><td>${c.percent}%</td><td>${c.active ? "فعّال" : "متوقف"}</td>
          <td>${c.active ? `<button class="btn btn-danger btn-sm" onclick="stopCoupon('${esc(c.code)}')">إيقاف</button>` : ""}</td></tr>`).join("")}
      </table></div>
    </div>

    <div class="panel">
      <h3>العملاء</h3>
      ${customers.length ? `<div class="table-wrap"><table>
        <tr><th>الاسم</th><th>البريد</th><th>تاريخ التسجيل</th><th>عدد المشتريات</th></tr>
        ${customers.map(u => `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${fmtDate(u.created_at)}</td><td>${u.purchases}</td></tr>`).join("")}
      </table></div>` : `<div class="empty">لا يوجد عملاء.</div>`}
    </div>
    <br><button class="btn btn-outline" onclick="logout()">تسجيل الخروج</button>
  `;

  document.getElementById("addProd").onclick = () => run(async () => {
    const name = document.getElementById("nName").value.trim();
    if (!name) { toast("اكتب اسم المنتج"); return; }
    const cat = document.getElementById("nCat").value;
    await api("/api/admin/products", { method: "POST", body: {
      name, cat, icon: (CATEGORIES.find(c => c.key === cat) || {}).icon,
      price: Number(document.getElementById("nPrice").value) || 0,
      old: Number(document.getElementById("nOld").value) || 0,
      desc: document.getElementById("nDesc").value.trim() || "منتج جديد" } });
    toast("تمت الإضافة ✔");
  });

  document.getElementById("addCoupon").onclick = () => run(async () => {
    await api("/api/admin/coupons", { method: "POST", body: {
      code: document.getElementById("cCode").value, percent: Number(document.getElementById("cPercent").value) } });
    toast("تم حفظ الكوبون ✔");
  });
}

/* تنفيذ عملية ثم إعادة رسم اللوحة، مع عرض أي خطأ */
async function run(fn) {
  try { await fn(); await renderAdmin(); } catch (e) { toast(e.message); }
}
const togglePublish = (id, published) => run(() => api("/api/admin/products/" + id, { method: "PUT", body: { published } }));
const stopCoupon = code => run(() => api("/api/admin/coupons/" + encodeURIComponent(code), { method: "DELETE" }));
const setOrderStatus = (id, status) => run(async () => {
  await api(`/api/admin/orders/${id}/status`, { method: "PUT", body: { status } }); toast("تم تحديث الحالة");
});
const deleteProduct = id => { if (confirm("حذف المنتج؟")) run(async () => {
  const r = await api("/api/admin/products/" + id, { method: "DELETE" }); if (r.note) toast(r.note); }); };
const uploadFile = (id, input) => run(async () => {
  if (!input.files[0]) return;
  const form = new FormData(); form.append("file", input.files[0]);
  toast("جاري رفع الملف...");
  await api(`/api/admin/products/${id}/file`, { method: "POST", form });
  toast("تم رفع الملف ✔");
});
