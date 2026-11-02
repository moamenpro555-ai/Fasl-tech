/* ===== تسجيل الدخول وإنشاء حساب (متصل بالـ API) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const next = new URLSearchParams(location.search).get("next") || "account.html";
  const loginForm = document.getElementById("loginForm");
  const regForm = document.getElementById("registerForm");
  const tabL = document.getElementById("tabLogin"), tabR = document.getElementById("tabRegister");

  if (getToken() && getUser()) { location.href = next; return; }

  function showTab(login) {
    loginForm.style.display = login ? "block" : "none";
    regForm.style.display = login ? "none" : "block";
    tabL.classList.toggle("active", login);
    tabR.classList.toggle("active", !login);
  }
  tabL.onclick = () => showTab(true);
  tabR.onclick = () => showTab(false);

  // دالة مشتركة: تعطّل الزر أثناء الطلب وتعرض الأخطاء
  async function submit(form, path, body) {
    const btn = form.querySelector("button[type=submit]");
    const old = btn.textContent;
    btn.disabled = true; btn.textContent = "جاري الاتصال...";
    try {
      const data = await api(path, { method: "POST", body });
      saveSession(data);
      location.href = next;
    } catch (e) {
      toast(e.message);
      btn.disabled = false; btn.textContent = old;
    }
  }

  regForm.onsubmit = e => {
    e.preventDefault();
    submit(regForm, "/api/auth/register", {
      name: document.getElementById("rName").value.trim(),
      email: document.getElementById("rEmail").value.trim(),
      password: document.getElementById("rPass").value
    });
  };

  loginForm.onsubmit = e => {
    e.preventDefault();
    submit(loginForm, "/api/auth/login", {
      email: document.getElementById("lEmail").value.trim(),
      password: document.getElementById("lPass").value
    });
  };
});
