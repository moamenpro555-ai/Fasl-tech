/* ===== الاتصال بالـ Backend =====
   غيّر الرابط ده فقط لو غيّرت رابط السيرفر */
const API_URL = "https://facl-tech-api.onrender.com";

const TOKEN_KEY = "fasl_token";
const getToken = () => localStorage.getItem(TOKEN_KEY);

/* دالة موحدة لطلبات الـ API
   - بتضيف التوكن تلقائيًا لو العميل مسجل دخول
   - بترمي Error برسالة عربية لو السيرفر رد بخطأ */
async function api(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;
  let payload;
  if (form) payload = form;                       // رفع ملف
  else if (body) { headers["Content-Type"] = "application/json"; payload = JSON.stringify(body); }

  let res;
  try {
    res = await fetch(API_URL + path, { method, headers, body: payload });
  } catch (e) {
    throw new Error("تعذر الاتصال بالسيرفر. لو أول مرة بعد فترة استنى نصف دقيقة وجرب تاني.");
  }
  let data = null;
  try { data = await res.json(); } catch (e) {}
  if (!res.ok) {
    if (res.status === 401 && token) { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem("fasl_user"); }
    throw new Error((data && data.error) || "حدث خطأ، حاول مرة أخرى");
  }
  return data;
}

/* المنتجات: نحمّلها مرة واحدة في كل صفحة ونحتفظ بها */
let _productsCache = null;
async function fetchProducts() {
  if (!_productsCache) _productsCache = await api("/api/products?sort=best");
  return _productsCache;
}

/* حفظ بيانات الدخول بعد تسجيل الدخول/التسجيل */
function saveSession(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem("fasl_user", JSON.stringify(data.user));
}
function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("fasl_user");
  location.href = "index.html";
}

/* رسالة تحميل / خطأ داخل عنصر */
function showLoading(el, msg = "جاري التحميل...") { el.innerHTML = `<div class="empty">⏳ ${msg}</div>`; }
function showError(el, e) { el.innerHTML = `<div class="empty">⚠️ ${e.message}</div>`; }
