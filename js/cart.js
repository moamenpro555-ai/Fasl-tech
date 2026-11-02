/* ===== السلة وإتمام الطلب (متصلة بالـ API) ===== */
let allProducts = [];
let coupon = null; // { code, percent }

function cartProducts() { return getCart().map(id => allProducts.find(p => p.id === id)).filter(Boolean); }

function renderCart() {
  const items = cartProducts();
  const box = document.getElementById("cartItems");

  box.innerHTML = items.length ? items.map(p => `
    <div class="cart-item">
      <div class="mini" style="background:${p.bg}">${p.icon}</div>
      <div class="info"><b>${esc(p.name)}</b><br><small>${catName(p.cat)}</small></div>
      <div><span class="price">${money(p.price)}</span></div>
      <button class="btn btn-danger btn-sm" onclick="removeFromCart(${p.id});renderCart()">حذف</button>
    </div>`).join("")
    : `<div class="empty">السلة فارغة 🛒<br><br><a class="btn btn-gold" href="products.html">تصفح المنتجات</a></div>`;

  const sub = items.reduce((s, p) => s + p.price, 0);
  const disc = coupon ? Math.round(sub * coupon.percent / 100) : 0;
  document.getElementById("sub").textContent = sub + " جنيه";
  document.getElementById("disc").textContent = disc + " جنيه";
  document.getElementById("total").textContent = (sub - disc) + " جنيه";
  document.getElementById("checkoutBtn").disabled = !items.length;
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("method").innerHTML =
    Object.entries(PAY_METHODS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");

  showLoading(document.getElementById("cartItems"));
  try { allProducts = await fetchProducts(); }
  catch (e) { showError(document.getElementById("cartItems"), e); return; }

  // تنظيف السلة من منتجات لم تعد موجودة
  save(KEYS.cart, getCart().filter(id => allProducts.some(p => p.id === id)));
  updateCounts();

  // تطبيق الكوبون: التحقق من السيرفر
  document.getElementById("couponBtn").onclick = async () => {
    const code = document.getElementById("couponInput").value.trim();
    if (!code) return;
    try {
      coupon = await api("/api/coupons/validate", { method: "POST", body: { code } });
      toast(`تم تطبيق خصم ${coupon.percent}% ✔`);
    } catch (e) { coupon = null; toast(e.message); }
    renderCart();
  };

  document.getElementById("checkoutBtn").onclick = async () => {
    if (!getToken()) { toast("سجّل دخولك أولًا لإتمام الشراء"); setTimeout(() => location.href = "login.html?next=cart.html", 900); return; }

    const btn = document.getElementById("checkoutBtn");
    btn.disabled = true; btn.textContent = "جاري إنشاء الطلب...";
    try {
      const order = await api("/api/orders", {
        method: "POST",
        body: { items: getCart(), method: document.getElementById("method").value, coupon: coupon ? coupon.code : undefined }
      });
      save(KEYS.cart, []); updateCounts();
      toast(order.status === "done" ? "تم! المنتج في مكتبتك ✔" : "تم إنشاء الطلب وبانتظار تأكيد الدفع");
      setTimeout(() => location.href = order.status === "done" ? "account.html#library" : "account.html#orders", 1100);
    } catch (e) {
      toast(e.message);
      btn.disabled = false; btn.textContent = "إتمام الطلب";
    }
  };

  renderCart();
});
