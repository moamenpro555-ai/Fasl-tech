/* ===== صفحة تفاصيل المنتج ===== */
document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  const box = document.getElementById("productBox");
  showLoading(box, "جاري تحميل المنتج...");

  let p, all = [];
  try {
    p = await api("/api/products/" + encodeURIComponent(id));
    all = await fetchProducts();
  } catch (e) {
    box.innerHTML = `<div class="empty">${esc(e.message)}. <a href="products.html"><b>العودة للمنتجات</b></a></div>`;
    return;
  }

  document.title = p.name + " | FASL TECH";
  const li = arr => (arr || []).map(x => `<li>${esc(x)}</li>`).join("");
  const similar = all.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const section = (title, html) => html ? `<div class="tabs-box"><h3>${title}</h3>${html}</div>` : "";

  box.innerHTML = `
    <div class="detail">
      <div class="detail-img" style="background:${p.bg}">${p.icon}</div>
      <div>
        <small>${catName(p.cat)}</small>
        <h1>${esc(p.name)}</h1>
        <div class="rating"><b>★ ${p.rating}</b> (${p.reviews} تقييم)</div>
        <p style="margin:10px 0">${esc(p.desc)}</p>
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
    ${section("المشكلة التي يحلها المنتج", p.problem ? `<p>${esc(p.problem)}</p>` : "")}
    ${section("المميزات", p.features.length ? `<ul>${li(p.features)}</ul>` : "")}
    ${section("محتويات الباقة", p.contents.length ? `<ul>${li(p.contents)}</ul>` : "")}
    ${section("البرامج والأجهزة المتوافقة", p.compat.length ? `<ul>${li(p.compat)}</ul>` : "")}
    ${section("أسئلة شائعة", p.faq.length ? p.faq.map(f => `<div class="faq-item"><b>${esc(f[0])}</b>${esc(f[1])}</div>`).join("") : "")}
    ${similar.length ? `<div class="section-head"><h2>منتجات مشابهة</h2></div>
      <div class="products-grid three" style="margin-bottom:30px">${similar.map(productCard).join("")}</div>` : ""}
  `;
});
