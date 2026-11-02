/* ===== صفحة المنتجات: بحث + فلترة + ترتيب ===== */
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const qInput = document.getElementById("q");
  const listBox = document.getElementById("list");
  qInput.value = params.get("q") || "";

  document.getElementById("catFilters").innerHTML = CATEGORIES.map(c =>
    `<label><input type="radio" name="cat" value="${c.key}"> ${c.name}</label>`).join("");

  const wanted = params.get("cat");
  if (wanted) {
    const r = document.querySelector(`input[name=cat][value="${wanted}"]`);
    if (r) r.checked = true;
  }

  showLoading(listBox, "جاري تحميل المنتجات... (أول مرة قد تستغرق نصف دقيقة)");
  let all = [];
  try { all = await fetchProducts(); } catch (e) { showError(listBox, e); return; }

  function render() {
    const q = qInput.value.trim().toLowerCase();
    const cat = document.querySelector("input[name=cat]:checked").value;
    const type = document.querySelector("input[name=type]:checked").value;
    const sort = document.getElementById("sort").value;

    let list = all.filter(p =>
      (!q || (p.name + " " + p.desc).toLowerCase().includes(q)) &&
      (!cat || p.cat === cat) &&
      (!type || (type === "free" ? p.price === 0 : p.price > 0)));

    if (sort === "best") list.sort((a, b) => b.sales - a.sales);
    if (sort === "new") list.sort((a, b) => b.id - a.id);
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    listBox.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="empty" style="grid-column:1/-1">لا توجد منتجات مطابقة 🔎</div>`;
  }

  document.querySelectorAll("input[name=cat], input[name=type], #sort").forEach(el => el.addEventListener("change", render));
  qInput.addEventListener("input", render);
  document.getElementById("resetBtn").onclick = () => { location.href = "products.html"; };
  render();
});
