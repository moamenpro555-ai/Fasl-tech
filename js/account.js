/* ===== لوحة العميل: المكتبة، الطلبات، المفضلة، الحساب (متصلة بالـ API) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  if (!user || !getToken()) { location.href = "login.html?next=account.html"; return; }
  document.getElementById("hello").textContent = "أهلًا، " + user.name;
  const content = document.getElementById("content");

  const statusTag = s => `<span class="status ${STATUS[s][1]}">${STATUS[s][0]}</span>`;

  const tabs = {
    async library() {
      showLoading(content);
      try {
        const list = await api("/api/library");
        content.innerHTML = `<h3>📚 مكتبة مشترياتي</h3>` + (list.length ? list.map(p => `
          <div class="cart-item">
            <div class="mini" style="background:${p.bg}">${p.icon}</div>
            <div class="info"><b>${esc(p.name)}</b><br><small>${catName(p.cat)} · إصدار ${esc(p.version)}</small></div>
            <button class="btn btn-gold btn-sm" onclick="downloadProduct(${p.id})">⬇ تحميل</button>
          </div>`).join("") : `<div class="empty">لا توجد مشتريات مكتملة بعد.<br><br><a class="btn btn-gold" href="products.html">تصفح المنتجات</a></div>`);
      } catch (e) { showError(content, e); }
    },

    async orders() {
      showLoading(content);
      try {
        const list = await api("/api/orders/mine");
        content.innerHTML = `<h3>🧾 سجل الطلبات</h3>` + (list.length ? `
          <div class="table-wrap"><table>
            <tr><th>رقم الطلب</th><th>التاريخ</th><th>المنتجات</th><th>الإجمالي</th><th>الدفع</th><th>الحالة</th></tr>
            ${list.map(o => `<tr>
              <td>${o.id}</td><td>${fmtDate(o.created_at)}</td>
              <td>${o.items.map(i => esc(i.name)).join("، ")}</td>
              <td>${o.total} جنيه</td><td>${PAY_METHODS[o.method] || o.method}</td><td>${statusTag(o.status)}</td>
            </tr>`).join("")}
          </table></div>
          ${list.some(o => o.status === "pending") ? `<p class="note" style="margin-top:12px">الطلبات "بانتظار الدفع" بتتفعّل بعد تأكيد الدفع من الإدارة، وبعدها المنتج يظهر في مكتبتك.</p>` : ""}`
          : `<div class="empty">لا توجد طلبات بعد.</div>`);
      } catch (e) { showError(content, e); }
    },

    async wish() {
      showLoading(content);
      try {
        const ids = load(KEYS.wish, []);
        const all = await fetchProducts();
        const list = ids.map(id => all.find(p => p.id === id)).filter(Boolean);
        content.innerHTML = `<h3>♡ المفضلة</h3>` + (list.length
          ? `<div class="products-grid three">${list.map(productCard).join("")}</div>`
          : `<div class="empty">قائمة المفضلة فارغة.</div>`);
      } catch (e) { showError(content, e); }
    },

    profile() {
      content.innerHTML = `<h3>👤 بيانات الحساب</h3>
        <div class="form-row"><label>الاسم</label><input type="text" id="pName" value="${esc(user.name)}"></div>
        <div class="form-row"><label>البريد الإلكتروني</label><input type="text" value="${esc(user.email)}" disabled></div>
        <div class="form-row"><label>كلمة مرور جديدة</label><input type="password" id="pPass" placeholder="اتركها فارغة إن لم ترد التغيير"></div>
        <button class="btn btn-gold" id="saveProfile">حفظ</button>
        ${user.role === "admin" ? `<a class="btn btn-navy" href="admin.html" style="margin-inline-start:8px">لوحة الأدمن</a>` : ""}`;
      document.getElementById("saveProfile").onclick = async () => {
        try {
          const body = { name: document.getElementById("pName").value.trim() };
          const pass = document.getElementById("pPass").value;
          if (pass) body.password = pass;
          const data = await api("/api/auth/me", { method: "PUT", body });
          localStorage.setItem(KEYS.user, JSON.stringify(data.user));
          toast("تم الحفظ ✔"); setTimeout(() => location.reload(), 700);
        } catch (e) { toast(e.message); }
      };
    }
  };

  function openTab(name) {
    if (!tabs[name]) name = "library";
    document.querySelectorAll("#sideMenu [data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    tabs[name]();
  }

  document.querySelectorAll("#sideMenu [data-tab]").forEach(b => b.onclick = () => openTab(b.dataset.tab));
  document.getElementById("logoutBtn").onclick = logout;
  openTab(location.hash.replace("#", "") || "library");
});

/* التحميل الآمن: نطلب رابط مؤقت من السيرفر (بعد التحقق من الملكية) ثم نفتحه */
async function downloadProduct(id) {
  try {
    const data = await api(`/api/downloads/${id}/link`);
    toast("بدأ التحميل ⬇");
    window.location.href = API_URL + data.url;
  } catch (e) { toast(e.message); }
}
