/* ===== بيانات ثابتة في الفرونت إند =====
   المنتجات والكوبونات والطلبات كلها بتيجي من الـ Backend (انظر api.js) */

const CATEGORIES = [
  { key: "students", name: "إدارة الطلاب", icon: "👥" },
  { key: "grades", name: "الدرجات والامتحانات", icon: "🏆" },
  { key: "planning", name: "التخطيط والتنظيم", icon: "🗓️" },
  { key: "reports", name: "التقارير والمتابعة", icon: "📈" }
];

const STATUS = {
  pending: ["بانتظار الدفع", "st-pending"],
  done: ["مكتمل", "st-done"],
  failed: ["فاشل", "st-failed"],
  cancel: ["ملغي", "st-cancel"],
  refund: ["مسترد", "st-refund"]
};

const PAY_METHODS = {
  card: "بطاقة بنكية",
  wallet: "محفظة إلكترونية",
  cash: "دفع نقدي (مرجع دفع)",
  transfer: "تحويل يدوي"
};

const TESTIMONIALS = [
  { text: "أدوات رائعة وتنظيم ممتاز .. وفرت علي وقت وجهد كبير في إدارة طلابي.", name: "أ. منى أحمد", job: "معلمة لغة عربية" },
  { text: "نظام الدرجات غيّر طريقة شغلي، التقارير بتطلع في ثواني.", name: "أ. محمد علي", job: "معلم رياضيات" },
  { text: "الدعم الفني سريع والملفات سهلة جدًا حتى للمبتدئين.", name: "أ. سارة حسن", job: "معلمة علوم" }
];
