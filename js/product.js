/* ===== صفحة تفاصيل المنتج ===== */
document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  const p = getProduct(id);
  const box = document.getElementById("productBox");

  if (!p || !p.published) {
    box.innerHTML = `<div class="empty">المنتج غير موجود. <a href="products.html"><b>العودة للمنتجات</b></a></div>`;
    return;
  }
  document.title = p.name + " | FASL TECH";
  const li = arr => arr.map(x => `<li>${x}</li>`).join("");
  const similar = getStoreProducts().filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  box.innerHTML = `
    <div class="detail">
      <div class="detail-img" style="background:${p.bg}">${p.icon}</div>
      <div>
        <small>${catName(p.cat)}</small>
        <h1>${p.name}</h1>
        <div class="rating"><b>★ ${p.rating}</b> (${p.reviews} تقييم)</div>
        <p style="margin:10px 0">${p.desc}</p>
        <div><span class="price ${p.price === 0 ? "free" : ""}">${money(p.price)}</span>
          ${p.old ? `<span class="old">${p.old} جنيه</span> <span class="status st-pending">خصم ${discount(p)}%</span>` : ""}</div>
        <div class="actions">
          <button class="btn btn-gold" onclick="addToCart(${p.id})">🛒 أضف إلى السلة</button>
          <button class="btn btn-navy" onclick="addToCart(${p.id});location.href='cart.html'">اشترِ الآن</button>
          <button class="btn btn-outline" onclick="toggleWish(${p.id})">♡ المفضلة</button>
        </div>
        <p style="font-size:.85rem;color:var(--muted)">⬇ تحميل فوري بعد تأكيد الدفع · 🔒 رابط تحميل آمن</p>
      </div>
    </div>

    <div class="tabs-box"><h3>المشكلة التي يحلها المنتج</h3><p>${p.problem}</p></div>
    <div class="tabs-box"><h3>المميزات</h3><ul>${li(p.features)}</ul></div>
    <div class="tabs-box"><h3>محتويات الباقة</h3><ul>${li(p.contents)}</ul></div>
    <div class="tabs-box"><h3>البرامج والأجهزة المتوافقة</h3><ul>${li(p.compat)}</ul></div>
    <div class="tabs-box"><h3>أسئلة شائعة</h3>
      ${p.faq.map(f => `<div class="faq-item"><b>${f[0]}</b>${f[1]}</div>`).join("")}</div>

    ${similar.length ? `<div class="section-head"><h2>منتجات مشابهة</h2></div>
      <div class="products-grid three" style="margin-bottom:30px">${similar.map(productCard).join("")}</div>` : ""}
  `;
});
