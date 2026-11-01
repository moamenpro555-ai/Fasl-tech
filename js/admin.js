/* ===== لوحة تحكم الأدمن (تجريبية) =====
   كلمة المرور التجريبية: admin123
   تنبيه: هذا للتجربة فقط، والحماية الحقيقية لازم تكون من الـ Backend. */
const ADMIN_PASS = "admin123";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("adminRoot");

  if (sessionStorage.getItem("fasl_admin") !== "1") {
    root.innerHTML = `<div class="auth-box" style="margin-top:0"><h3 style="margin-bottom:14px">دخول الأدمن</h3>
      <div class="form-row"><input type="password" id="apass" placeholder="كلمة المرور"></div>
      <button class="btn btn-gold btn-block" id="aBtn">دخول</button></div>`;
    document.getElementById("aBtn").onclick = () => {
      if (document.getElementById("apass").value === ADMIN_PASS) { sessionStorage.setItem("fasl_admin", "1"); location.reload(); }
      else toast("كلمة المرور غير صحيحة");
    };
    return;
  }
  renderAdmin();
});

function renderAdmin() {
  const root = document.getElementById("adminRoot");
  const products = getProducts();
  const orders = load(KEYS.orders, []);
  const users = load(KEYS.users, []);
  const revenue = orders.filter(o => o.status === "done").reduce((s, o) => s + o.total, 0);
  const refunded = orders.filter(o => o.status === "refund").reduce((s, o) => s + o.total, 0);

  root.innerHTML = `
    <div class="stats">
      <div class="stat"><b>${revenue} جنيه</b><span>الإيرادات</span></div>
      <div class="stat"><b>${orders.length}</b><span>الطلبات</span></div>
      <div class="stat"><b>${users.length}</b><span>العملاء</span></div>
      <div class="stat"><b>${refunded} جنيه</b><span>المبالغ المستردة</span></div>
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
        <tr><th>المنتج</th><th>التصنيف</th><th>السعر</th><th>المبيعات</th><th>النشر</th><th></th></tr>
        ${products.map(p => `<tr>
          <td>${p.icon} ${p.name}</td><td>${catName(p.cat)}</td><td>${money(p.price)}</td><td>${p.sales}</td>
          <td><button class="btn btn-outline btn-sm" onclick="togglePublish(${p.id})">${p.published ? "منشور ✔" : "مسودة"}</button></td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">حذف</button></td>
        </tr>`).join("")}
      </table></div>
    </div>

    <div class="panel" style="margin-bottom:20px">
      <h3>إدارة الطلبات</h3>
      ${orders.length ? `<div class="table-wrap"><table>
        <tr><th>رقم الطلب</th><th>العميل</th><th>الإجمالي</th><th>التاريخ</th><th>الحالة</th></tr>
        ${orders.slice().reverse().map(o => `<tr>
          <td>${o.id}</td><td>${o.user}</td><td>${o.total} جنيه</td><td>${o.date}</td>
          <td><select onchange="setOrderStatus('${o.id}', this.value)">
            ${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === o.status ? "selected" : ""}>${v[0]}</option>`).join("")}
          </select></td></tr>`).join("")}
      </table></div>` : `<div class="empty">لا توجد طلبات.</div>`}
    </div>

    <div class="panel">
      <h3>العملاء</h3>
      ${users.length ? `<div class="table-wrap"><table>
        <tr><th>الاسم</th><th>البريد</th><th>تاريخ التسجيل</th><th>عدد المشتريات</th></tr>
        ${users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.joined || "-"}</td><td>${ownedIds(u.email).length}</td></tr>`).join("")}
      </table></div>` : `<div class="empty">لا يوجد عملاء.</div>`}
    </div>
    <br><button class="btn btn-outline" onclick="sessionStorage.removeItem('fasl_admin');location.reload()">تسجيل خروج الأدمن</button>
  `;

  document.getElementById("addProd").onclick = () => {
    const name = document.getElementById("nName").value.trim();
    if (!name) { toast("اكتب اسم المنتج"); return; }
    const list = getProducts();
    const cat = document.getElementById("nCat").value;
    list.push({
      id: Math.max(0, ...list.map(p => p.id)) + 1, name, cat,
      icon: (CATEGORIES.find(c => c.key === cat) || {}).icon || "📦",
      bg: "linear-gradient(135deg,#e3e8f2,#c5cfe6)",
      price: Number(document.getElementById("nPrice").value) || 0,
      old: Number(document.getElementById("nOld").value) || 0,
      rating: 5, reviews: "0", sales: 0, published: true,
      desc: document.getElementById("nDesc").value.trim() || "منتج جديد",
      problem: "", features: [], contents: [], compat: [], faq: []
    });
    save(KEYS.products, list); renderAdmin(); toast("تمت الإضافة ✔");
  };
}

function togglePublish(id) {
  const list = getProducts(); const p = list.find(x => x.id === id);
  p.published = !p.published; save(KEYS.products, list); renderAdmin();
}
function deleteProduct(id) {
  if (!confirm("حذف المنتج نهائيًا؟")) return;
  save(KEYS.products, getProducts().filter(p => p.id !== id)); renderAdmin();
}
function setOrderStatus(orderId, status) {
  const orders = load(KEYS.orders, []); const o = orders.find(x => x.id === orderId);
  o.status = status; save(KEYS.orders, orders); renderAdmin(); toast("تم تحديث الحالة");
}
