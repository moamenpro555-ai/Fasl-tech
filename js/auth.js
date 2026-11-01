/* ===== تسجيل الدخول وإنشاء حساب (تجريبي بدون Backend) =====
   ملاحظة: الحفظ هنا في المتصفح فقط. في النسخة الحقيقية يتم ذلك عبر Backend وتشفير كلمات المرور. */
document.addEventListener("DOMContentLoaded", () => {
  const next = new URLSearchParams(location.search).get("next") || "account.html";
  const loginForm = document.getElementById("loginForm");
  const regForm = document.getElementById("registerForm");
  const tabL = document.getElementById("tabLogin"), tabR = document.getElementById("tabRegister");

  function showTab(login) {
    loginForm.style.display = login ? "block" : "none";
    regForm.style.display = login ? "none" : "block";
    tabL.classList.toggle("active", login);
    tabR.classList.toggle("active", !login);
  }
  tabL.onclick = () => showTab(true);
  tabR.onclick = () => showTab(false);

  regForm.onsubmit = e => {
    e.preventDefault();
    const users = load(KEYS.users, []);
    const email = document.getElementById("rEmail").value.trim().toLowerCase();
    if (users.some(u => u.email === email)) { toast("هذا البريد مسجل بالفعل"); return; }
    const user = { name: document.getElementById("rName").value.trim(), email, pass: document.getElementById("rPass").value, joined: new Date().toLocaleDateString("ar-EG") };
    users.push(user); save(KEYS.users, users);
    save(KEYS.user, { name: user.name, email });
    location.href = next;
  };

  loginForm.onsubmit = e => {
    e.preventDefault();
    const email = document.getElementById("lEmail").value.trim().toLowerCase();
    const pass = document.getElementById("lPass").value;
    const u = load(KEYS.users, []).find(u => u.email === email && u.pass === pass);
    if (!u) { toast("البريد أو كلمة المرور غير صحيحة"); return; }
    save(KEYS.user, { name: u.name, email });
    location.href = next;
  };
});
