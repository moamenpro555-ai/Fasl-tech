/* ===== الصفحة الرئيسية ===== */
document.addEventListener("DOMContentLoaded", async () => {
  // التصنيفات (ثابتة)
  document.getElementById("catsGrid").innerHTML = CATEGORIES.map(c =>
    `<a class="cat-item" href="products.html?cat=${c.key}"><span>${c.icon}</span>${c.name}</a>`).join("");

  // آراء العملاء
  let i = 0;
  const card = document.getElementById("testiCard");
  function showTesti() {
    const t = TESTIMONIALS[i];
    card.innerHTML = `<p>${t.text}</p><div class="who">${t.name}</div><small>${t.job}</small><div class="stars">★★★★★</div>`;
  }
  document.getElementById("tNext").onclick = () => { i = (i + 1) % TESTIMONIALS.length; showTesti(); };
  document.getElementById("tPrev").onclick = () => { i = (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length; showTesti(); };
  showTesti();
  setInterval(() => { i = (i + 1) % TESTIMONIALS.length; showTesti(); }, 6000);

  // أكثر المنتجات مبيعًا من الـ API
  const box = document.getElementById("bestSellers");
  showLoading(box, "جاري تحميل المنتجات... (أول مرة قد تستغرق نصف دقيقة)");
  try {
    const products = await fetchProducts();
    box.innerHTML = products.slice(0, 3).map(productCard).join("");
  } catch (e) { showError(box, e); }
});
