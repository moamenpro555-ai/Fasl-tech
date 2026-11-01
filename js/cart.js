/* ===== السلة وإتمام الطلب ===== */
let couponPercent = Number(sessionStorage.getItem("fasl_coupon") || 0);

function cartProducts() { return getCart().map(getProduct).filter(Boolean); }

function renderCart() {
  const items = cartProducts();
  const box = document.getElementById("cartItems");

  box.innerHTML = items.length ? items.map(p => `
    <div class="cart-item">
      <div class="mini" style="background:${p.bg}">${p.icon}</div>
      <div class="info"><b>${p.name}</b><br><small>${catName(p.cat)}</small></div>
      <div><span class="price">${money(p.price)}</span></div>
      <button class="btn btn-danger btn-sm" onclick="removeFromCart(${p.id});renderCart()">حذف</button>
    </div>`).join("")
    : `<div class="empty">السلة فارغة 🛒<br><br><a class="btn btn-gold" href="products.html">تصفح المنتجات</a></div>`;

  const sub = items.reduce((s, p) => s + p.price, 0);
  const disc = Math.round(sub * couponPercent / 100);
  document.getElementById("sub").textContent = sub + " جنيه";
  document.getElementById("disc").textContent = disc + " جنيه";
  document.getElementById("total").textContent = (sub - disc) + " جنيه";
  document.getElementById("checkoutBtn").disabled = !items.length;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("method").innerHTML =
    Object.entries(PAY_METHODS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");

  document.getElementById("couponBtn").onclick = () => {
    const code = document.getElementById("couponInput").value.trim().toUpperCase();
    if (COUPONS[code]) {
      couponPercent = COUPONS[code];
      sessionStorage.setItem("fasl_coupon", couponPercent);
      toast("تم تطبيق الكوبون ✔");
    } else { toast("كود الخصم غير صحيح"); }
    renderCart();
  };

  document.getElementById("checkoutBtn").onclick = () => {
    const user = getUser();
    if (!user) { toast("سجّل دخولك أولًا لإتمام الشراء"); setTimeout(() => location.href = "login.html?next=cart.html", 900); return; }

    const items = cartProducts();
    const sub = items.reduce((s, p) => s + p.price, 0);
    const total = sub - Math.round(sub * couponPercent / 100);
    const orders = load(KEYS.orders, []);

    orders.push({
      id: "FT" + Date.now().toString().slice(-7),
      user: user.email,
      items: items.map(p => p.id),
      total,
      method: document.getElementById("method").value,
      // المنتجات المجانية تُتاح فورًا، أما المدفوعة فتنتظر تأكيد الدفع
      status: total === 0 ? "done" : "pending",
      date: new Date().toLocaleString("ar-EG")
    });
    save(KEYS.orders, orders);
    save(KEYS.cart, []);
    sessionStorage.removeItem("fasl_coupon");
    toast(total === 0 ? "تم! المنتج في مكتبتك" : "تم إنشاء الطلب وبانتظار الدفع");
    setTimeout(() => location.href = "account.html#orders", 1000);
  };

  renderCart();
});
