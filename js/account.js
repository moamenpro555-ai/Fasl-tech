/* ===== لوحة العميل: المكتبة، الطلبات، المفضلة، الحساب ===== */
document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user) { location.href = "login.html?next=account.html"; return; }
  document.getElementById("hello").textContent = "أهلًا، " + user.name;
  const content = document.getElementById("content");

  const statusTag = s => `<span class="status ${STATUS[s][1]}">${STATUS[s][0]}</span>`;
  const myOrders = () => load(KEYS.orders, []).filter(o => o.user === user.email).reverse();

  const tabs = {
    library() {
      const ids = [...new Set(ownedIds(user.email))];
      content.innerHTML = `<h3>📚 مكتبة مشترياتي</h3>` + (ids.length ? ids.map(getProduct).filter(Boolean).map(p => `
        <div class="cart-item">
          <div class="mini" style="background:${p.bg}">${p.icon}</div>
          <div class="info"><b>${p.name}</b><br><small>${catName(p.cat)}</small></div>
          <button class="btn btn-gold btn-sm" onclick="downloadProduct(${p.id})">⬇ تحميل</button>
        </div>`).join("") : `<div class="empty">لا توجد مشتريات بعد.<br><br><a class="btn btn-gold" href="products.html">تصفح المنتجات</a></div>`);
    },

    orders() {
      const list = myOrders();
      content.innerHTML = `<h3>🧾 سجل الطلبات</h3>` + (list.length ? `
        <div class="table-wrap"><table>
          <tr><th>رقم الطلب</th><th>التاريخ</th><th>المنتجات</th><th>الإجمالي</th><th>الدفع</th><th>الحالة</th><th></th></tr>
          ${list.map(o => `<tr>
            <td>${o.id}</td><td>${o.date}</td>
            <td>${o.items.map(i => (getProduct(i) || {}).name).join("، ")}</td>
            <td>${o.total} جنيه</td><td>${PAY_METHODS[o.method]}</td><td>${statusTag(o.status)}</td>
            <td>${o.status === "pending" ? `<button class="btn btn-navy btn-sm" onclick="fakePay('${o.id}')">محاكاة تأكيد الدفع</button>` : ""}</td>
          </tr>`).join("")}
        </table></div>
        <p class="note" style="margin-top:12px">زر "محاكاة تأكيد الدفع" للتجربة فقط. في النسخة الحقيقية يتأكد السيرفر من الدفع عبر بوابة الدفع.</p>`
        : `<div class="empty">لا توجد طلبات بعد.</div>`);
    },

    wish() {
      const ids = load(KEYS.wish, []);
      const list = ids.map(getProduct).filter(Boolean);
      content.innerHTML = `<h3>♡ المفضلة</h3>` + (list.length
        ? `<div class="products-grid three">${list.map(productCard).join("")}</div>`
        : `<div class="empty">قائمة المفضلة فارغة.</div>`);
    },

    profile() {
      content.innerHTML = `<h3>👤 بيانات الحساب</h3>
        <div class="form-row"><label>الاسم</label><input type="text" id="pName" value="${user.name}"></div>
        <div class="form-row"><label>البريد الإلكتروني</label><input type="text" value="${user.email}" disabled></div>
        <div class="form-row"><label>كلمة مرور جديدة</label><input type="password" id="pPass" placeholder="اتركها فارغة إن لم ترد التغيير"></div>
        <button class="btn btn-gold" id="saveProfile">حفظ</button>`;
      document.getElementById("saveProfile").onclick = () => {
        const users = load(KEYS.users, []);
        const u = users.find(x => x.email === user.email);
        const name = document.getElementById("pName").value.trim() || user.name;
        const pass = document.getElementById("pPass").value;
        if (u) { u.name = name; if (pass.length >= 6) u.pass = pass; save(KEYS.users, users); }
        save(KEYS.user, { name, email: user.email });
        toast("تم الحفظ ✔"); setTimeout(() => location.reload(), 700);
      };
    }
  };

  function openTab(name) {
    if (!tabs[name]) name = "library";
    document.querySelectorAll("#sideMenu [data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    tabs[name]();
  }
  window.openTab = openTab;

  document.querySelectorAll("#sideMenu [data-tab]").forEach(b => b.onclick = () => openTab(b.dataset.tab));
  document.getElementById("logoutBtn").onclick = () => { localStorage.removeItem(KEYS.user); location.href = "index.html"; };
  openTab(location.hash.replace("#", "") || "library");
});

/* محاكاة تأكيد الدفع (تجريبي) */
function fakePay(orderId) {
  const orders = load(KEYS.orders, []);
  const o = orders.find(x => x.id === orderId);
  if (o) { o.status = "done"; save(KEYS.orders, orders); toast("تم تأكيد الدفع ✔"); openTab("orders"); }
}

/* تحميل تجريبي: ينشئ ملف نصي ويسجل عملية التحميل.
   في النسخة الحقيقية: السيرفر يتحقق من الملكية ويعطي رابط مؤقت لملف خاص. */
function downloadProduct(id) {
  const p = getProduct(id), user = getUser();
  const log = load(KEYS.downloads, []);
  log.push({ user: user.email, product: id, date: new Date().toLocaleString("ar-EG") });
  save(KEYS.downloads, log);
  const blob = new Blob([`FASL TECH\nمنتج: ${p.name}\nمرخص لـ: ${user.email}\n(ملف تجريبي - استبدله بالملف الحقيقي من السيرفر)`], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = p.name + ".txt"; a.click();
  toast("بدأ التحميل ⬇");
}
