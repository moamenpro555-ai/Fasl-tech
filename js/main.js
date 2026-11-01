/* ===== FASL TECH - الدوال المشتركة بين كل الصفحات ===== */

const KEYS = {
  cart: "fasl_cart", wish: "fasl_wish", user: "fasl_user",
  users: "fasl_users", orders: "fasl_orders", products: "fasl_products",
  downloads: "fasl_downloads"
};

/* ---------- التخزين (localStorage) ---------- */
function load(key, def) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v === null ? def : v; }
  catch (e) { return def; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function getProducts() { return load(KEYS.products, DEFAULT_PRODUCTS); }
function getStoreProducts() { return getProducts().filter(p => p.published); }
function getProduct(id) { return getProducts().find(p => p.id === Number(id)); }
function getUser() { return load(KEYS.user, null); }
function discount(p) { return p.old ? Math.round((1 - p.price / p.old) * 100) : 0; }
function money(n) { return n === 0 ? "مجاني" : n + " جنيه"; }
function catName(key) { const c = CATEGORIES.find(c => c.key === key); return c ? c.name : key; }

/* ---------- السلة والمفضلة ---------- */
function getCart() { return load(KEYS.cart, []); }
function addToCart(id) {
  const cart = getCart();
  if (cart.includes(id)) { toast("المنتج موجود بالفعل في السلة"); return; }
  const user = getUser();
  if (user && ownedIds(user.email).includes(id)) { toast("أنت تملك هذا المنتج بالفعل"); return; }
  cart.push(id); save(KEYS.cart, cart); updateCounts(); toast("تمت الإضافة إلى السلة ✔");
}
function removeFromCart(id) { save(KEYS.cart, getCart().filter(i => i !== id)); updateCounts(); }
function toggleWish(id, btn) {
  let w = load(KEYS.wish, []);
  if (w.includes(id)) { w = w.filter(i => i !== id); toast("تمت الإزالة من المفضلة"); }
  else { w.push(id); toast("تمت الإضافة إلى المفضلة ♥"); }
  save(KEYS.wish, w); updateCounts();
  if (btn) btn.classList.toggle("on", w.includes(id));
}

/* المنتجات التي اشتراها العميل (الطلبات المكتملة فقط) */
function ownedIds(email) {
  return load(KEYS.orders, []).filter(o => o.user === email && o.status === "done").flatMap(o => o.items);
}

/* ---------- إشعار صغير ---------- */
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- بطاقة المنتج ---------- */
function productCard(p) {
  const wished = load(KEYS.wish, []).includes(p.id);
  return `
  <div class="card">
    <div class="thumb" style="background:${p.bg};cursor:pointer" onclick="location.href='product.html?id=${p.id}'">
      ${p.old ? `<span class="disc">خصم ${discount(p)}%</span>` : ""}
      <button class="wish ${wished ? "on" : ""}" onclick="event.stopPropagation();toggleWish(${p.id},this)" aria-label="مفضلة">♥</button>
      ${p.icon}
    </div>
    <div class="card-body">
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p>${p.desc}</p>
      <div class="rating"><b>★ ${p.rating}</b> (${p.reviews})</div>
      <div class="price-row">
        <div><span class="price ${p.price === 0 ? "free" : ""}">${money(p.price)}</span> ${p.old ? `<span class="old">${p.old} جنيه</span>` : ""}</div>
        <button class="btn btn-navy btn-sm" onclick="addToCart(${p.id})">🛒 أضف للسلة</button>
      </div>
    </div>
  </div>`;
}

/* ---------- الهيدر والفوتر ---------- */
const LOGO_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#f5b942" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/></svg>`;

function renderHeader() {
  const page = document.body.dataset.page || "";
  const user = getUser();
  const act = p => (page === p ? "active" : "");
  document.getElementById("site-header").innerHTML = `
  <header class="header"><div class="container">
    <a href="index.html" class="logo">
      <div class="logo-icon">${LOGO_SVG}</div>
      <div class="logo-text"><strong>FASL TECH</strong><small>كل أدواتك كمدرس... في مكان</small></div>
    </a>
    <button class="menu-toggle" id="menuToggle" aria-label="القائمة">☰</button>
    <nav class="nav" id="nav">
      <a href="index.html" class="${act("home")}">الرئيسية</a>
      <a href="products.html" class="${act("products")}">المنتجات</a>
      <a href="products.html#cats">الأقسام</a>
      <a href="index.html#support">الدعم الفني</a>
      <a href="index.html#about">عن المتجر</a>
    </nav>
    <form class="search" id="searchForm">
      <input type="text" id="searchInput" placeholder="ابحث عن منتج...">
      <button type="submit">🔍</button>
    </form>
    <div class="header-icons">
      <a href="cart.html" aria-label="السلة">🛒<span class="badge" id="cartCount">0</span></a>
      <a href="account.html#wish" aria-label="المفضلة">♡<span class="badge" id="wishCount">0</span></a>
      <a href="${user ? "account.html" : "login.html"}" class="account-link">👤 ${user ? user.name : "حسابي"}</a>
    </div>
  </div></header>`;

  document.getElementById("menuToggle").onclick = () => document.getElementById("nav").classList.toggle("open");
  document.getElementById("searchForm").onsubmit = e => {
    e.preventDefault();
    location.href = "products.html?q=" + encodeURIComponent(document.getElementById("searchInput").value.trim());
  };
  updateCounts();
}

function updateCounts() {
  const c = document.getElementById("cartCount"), w = document.getElementById("wishCount");
  if (c) c.textContent = getCart().length;
  if (w) w.textContent = load(KEYS.wish, []).length;
}

function renderFooter() {
  document.getElementById("site-footer").innerHTML = `
  <footer class="footer"><div class="container">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="logo"><div class="logo-icon">${LOGO_SVG}</div>
        <div class="logo-text"><strong>FASL TECH</strong><small>كل أدواتك كمدرس... في مكان</small></div></a>
        <p style="margin-top:12px;font-size:.85rem" id="about">متجر متخصص في الأدوات الرقمية التي توفر وقت المعلم ومجهوده.</p>
      </div>
      <div id="support"><h4>تواصل معنا</h4>
        <ul><li>✉ support@fasltech.com</li><li>📞 01000000000</li></ul></div>
      <div><h4>معلومات مهمة</h4>
        <ul><li><a href="#">سياسة الخصوصية</a></li><li><a href="#">شروط الاستخدام</a></li><li><a href="#">سياسة الاسترداد</a></li></ul></div>
      <div><h4>روابط سريعة</h4>
        <ul><li><a href="index.html">الرئيسية</a></li><li><a href="products.html">المنتجات</a></li><li><a href="account.html">حسابي</a></li></ul></div>
      <div><h4>تابعنا على</h4>
        <div class="social"><a href="#">▶</a><a href="#">f</a><a href="#">✈</a><a href="#">in</a></div></div>
    </div>
    <div class="copy">© ${new Date().getFullYear()} FASL TECH - جميع الحقوق محفوظة</div>
  </div></footer>`;
}

document.addEventListener("DOMContentLoaded", () => { renderHeader(); renderFooter(); });
