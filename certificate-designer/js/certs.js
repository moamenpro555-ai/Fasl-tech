/* ===================== مصمم الشهادات ===================== */
(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon, D = FT.date;
  const PRESETS = {
    appreciation: ["شهادة تقدير", "تُمنح هذه الشهادة للطالب/ـة {name} تقديرًا لاجتهاده/ـا وتميّزه/ـا في مادة {subject}.\nمع خالص الشكر، وأطيب التمنيات بمزيدٍ من النجاح والتألق."],
    excel: ["شهادة تفوق", "تقديرًا لتفوّق الطالب/ـة {name} في مادة {subject}، وتحقيقه/ـا متوسطًا متميزًا قدره {avg}.\nإنجازٌ نفخر به، ومسيرةٌ نرجو لها دوام التقدم والتميّز."],
    attend: ["شهادة انتظام", "تقديرًا لالتزام الطالب/ـة {name} وانتظامه/ـا المشرّف، بنسبة حضور بلغت {att}.\nشكرًا لحرصه/ـا، مع أطيب التمنيات باستمرار النجاح."],
    grad: ["شهادة إتمام", "تشهد {teacher} بأن الطالب/ـة {name} قد أتم/ت متطلبات مادة {subject} بنجاح.\nمُنحت هذه الشهادة بتاريخ {date} تقديرًا للجدية والمثابرة."],
    part: ["شهادة مشاركة", "تقديرًا لمشاركة الطالب/ـة {name} الفاعلة وروحه/ـا الإيجابية في الأنشطة.\nنثمّن عطاءه/ـا، ونتمنى له/ـا مزيدًا من الإبداع والإنجاز."],
    thanks: ["شهادة شكر", "بكل التقدير والامتنان، نتقدم إلى {name} بخالص الشكر على دعمه/ـا وتعاونه/ـا.\nكان لعطائه/ـا أثرٌ طيب نعتز به، مع أصدق الأمنيات بدوام التوفيق."]
  };
  const SHAPES = [["land", "عرضي A4", 297, 210], ["port", "طولي A4", 210, 297], ["sq", "مربع", 210, 210], ["circle", "دائري", 210, 210]];
  const FONTS_UI = [["reem", "كلاسيكي أنيق", "\'Reem Kufi\',\'Cairo\',sans-serif"], ["cairo", "عصري واضح", "\'Cairo\',sans-serif"], ["aref", "خط عربي تراثي", "\'Aref Ruqaa\',serif"]];
  const PALETTES = [
    {"name":"ورق عاجي · ذهب ملكي","paper":"#fff9e9","deep":"#302411","accent":"#b78628","ink":"#3f2f1b","soft":"#816a43"},
    {"name":"أزرق ليلي · ذهب","paper":"#101b31","deep":"#091323","accent":"#e8c35a","ink":"#f4edda","soft":"#cfc8b3"},
    {"name":"عاجي · زمرد","paper":"#f5f7ef","deep":"#24473c","accent":"#a88746","ink":"#203b30","soft":"#687970"},
    {"name":"وردي عاجي · عنابي","paper":"#fff4f1","deep":"#5b2334","accent":"#b66c74","ink":"#4a2530","soft":"#806b70"},
    {"name":"أسود · ذهب مطفي","paper":"#111214","deep":"#08090c","accent":"#d7b15c","ink":"#f6edda","soft":"#d7c89f"},
    {"name":"ثلجي · أزرق سماوي","paper":"#f2fafd","deep":"#15526a","accent":"#3f9bb7","ink":"#183b50","soft":"#68818b"},
    {"name":"ليلكي · بنفسجي","paper":"#f8f3ff","deep":"#39285d","accent":"#9474c8","ink":"#3a2c58","soft":"#776a88"},
    {"name":"أخضر · نحاسي","paper":"#f3f8f3","deep":"#153d2f","accent":"#c09542","ink":"#224136","soft":"#688276"},
    {"name":"وردي · توتي","paper":"#fff5f8","deep":"#67374f","accent":"#c57c9b","ink":"#4e3040","soft":"#806977"},
    {"name":"كريمي · نحاس","paper":"#fff7f0","deep":"#7c4027","accent":"#c0784c","ink":"#52362a","soft":"#866c5d"},
    {"name":"أبيض · أزرق ملكي","paper":"#f3f5fc","deep":"#263969","accent":"#8ca5e8","ink":"#253250","soft":"#66759b"},
    {"name":"نعناعي · فيروزي","paper":"#effaf8","deep":"#105f60","accent":"#5fb9a9","ink":"#214747","soft":"#617f7d"},
    {"name":"رمادي لؤلؤي · فضي","paper":"#f6f6f7","deep":"#30343e","accent":"#aeb6c4","ink":"#292d35","soft":"#6d727b"},
    {"name":"كحلي · قرمزي","paper":"#121a2b","deep":"#0b1020","accent":"#cf7c72","ink":"#f5e9e3","soft":"#c6b5b0"},
    {"name":"لافندر · وردي ذهبي","paper":"#faf6fb","deep":"#583c5f","accent":"#d1a0b6","ink":"#44344a","soft":"#806d83"},
    {"name":"رمل · أزرق بترولي","paper":"#fbf6eb","deep":"#184858","accent":"#bd9254","ink":"#31414a","soft":"#77756d"},
    {"name":"أبيض · أخضر زيتوني","paper":"#f8f8ef","deep":"#536638","accent":"#b9a158","ink":"#39452f","soft":"#72795f"},
    {"name":"أزرق باودر · نحاس","paper":"#eff5f8","deep":"#34536a","accent":"#c58962","ink":"#31424d","soft":"#77838a"},
    {"name":"خوخي · برقوقي","paper":"#fff5ed","deep":"#623e50","accent":"#d39374","ink":"#49343c","soft":"#806b70"},
    {"name":"ورق قديم · حبر","paper":"#f1e5c9","deep":"#342a24","accent":"#9c7132","ink":"#30271e","soft":"#766650"}
  ];
  const TEMPLATE_SPECS = [
    {"id":1,"name":"التاج الملكي","palette":2,"frame":4,"photoShape":"shield","art":5,"side":"left","backdrop":9,"plate":2,"font":"reem","artpos":"near-photo"},
    {"id":2,"name":"ختم النخبة","palette":3,"frame":7,"photoShape":"hex","art":18,"side":"left","backdrop":8,"plate":4,"font":"reem","artpos":"bottom"},
    {"id":3,"name":"إكليل الإنجاز","palette":4,"frame":12,"photoShape":"diamond","art":16,"side":"left","backdrop":3,"plate":1,"font":"cairo","artpos":"top"},
    {"id":4,"name":"وسام التفوق","palette":1,"frame":15,"photoShape":"diamond","art":5,"side":"right","backdrop":8,"plate":6,"font":"cairo","artpos":"near-photo"},
    {"id":5,"name":"قصر الذهب","palette":9,"frame":6,"photoShape":"frame","art":16,"side":"right","backdrop":3,"plate":0,"font":"aref","artpos":"top"},
    {"id":6,"name":"الوردة الذهبية","palette":13,"frame":18,"photoShape":"arch","art":11,"side":"left","backdrop":8,"plate":2,"font":"aref","artpos":"outer"},
    {"id":7,"name":"المخطوطة الفاخرة","palette":7,"frame":7,"photoShape":"arch","art":14,"side":"left","backdrop":6,"plate":3,"font":"aref","artpos":"top"},
    {"id":8,"name":"درع الشرف","palette":0,"frame":1,"photoShape":"diamond","art":1,"side":"right","backdrop":5,"plate":4,"font":"cairo","artpos":"outer"},
    {"id":9,"name":"المرصّع بالنجوم","palette":17,"frame":19,"photoShape":"circle","art":2,"side":"right","backdrop":5,"plate":7,"font":"cairo","artpos":"outer"},
    {"id":10,"name":"بوابة المجد","palette":1,"frame":10,"photoShape":"diamond","art":4,"side":"left","backdrop":3,"plate":0,"font":"reem","artpos":"near-photo"},
    {"id":11,"name":"قبعة الخريج","palette":5,"frame":13,"photoShape":"scallop","art":8,"side":"left","backdrop":0,"plate":2,"font":"cairo","artpos":"near-photo"},
    {"id":12,"name":"كتاب المعرفة","palette":15,"frame":6,"photoShape":"circle","art":6,"side":"left","backdrop":6,"plate":2,"font":"aref","artpos":"near-photo"},
    {"id":13,"name":"صفحات التميّز","palette":4,"frame":5,"photoShape":"arch","art":8,"side":"left","backdrop":3,"plate":1,"font":"aref","artpos":"outer"},
    {"id":14,"name":"المكتبة العريقة","palette":15,"frame":11,"photoShape":"arch","art":9,"side":"left","backdrop":3,"plate":5,"font":"reem","artpos":"top"},
    {"id":15,"name":"راية العلم","palette":16,"frame":3,"photoShape":"frame","art":11,"side":"right","backdrop":7,"plate":5,"font":"cairo","artpos":"outer"},
    {"id":16,"name":"قلم المعلّم","palette":10,"frame":6,"photoShape":"hex","art":14,"side":"right","backdrop":8,"plate":2,"font":"reem","artpos":"top"},
    {"id":17,"name":"ميدالية الباحث","palette":11,"frame":13,"photoShape":"arch","art":4,"side":"right","backdrop":7,"plate":7,"font":"reem","artpos":"top"},
    {"id":18,"name":"منبر المعرفة","palette":11,"frame":5,"photoShape":"oval","art":5,"side":"left","backdrop":3,"plate":3,"font":"cairo","artpos":"outer"},
    {"id":19,"name":"سُلّم النجاح","palette":6,"frame":1,"photoShape":"scallop","art":1,"side":"right","backdrop":9,"plate":5,"font":"reem","artpos":"bottom"},
    {"id":20,"name":"شهادة الأستاذ","palette":19,"frame":10,"photoShape":"shield","art":18,"side":"right","backdrop":1,"plate":2,"font":"aref","artpos":"top"},
    {"id":21,"name":"بوابة الكرنك","palette":8,"frame":11,"photoShape":"circle","art":8,"side":"right","backdrop":0,"plate":4,"font":"aref","artpos":"near-photo"},
    {"id":22,"name":"جناح النيل","palette":11,"frame":5,"photoShape":"oval","art":12,"side":"left","backdrop":0,"plate":2,"font":"cairo","artpos":"near-photo"},
    {"id":23,"name":"قرص الشمس","palette":16,"frame":8,"photoShape":"round","art":10,"side":"left","backdrop":9,"plate":1,"font":"aref","artpos":"bottom"},
    {"id":24,"name":"زهرة اللوتس","palette":0,"frame":10,"photoShape":"arch","art":10,"side":"left","backdrop":5,"plate":6,"font":"aref","artpos":"outer"},
    {"id":25,"name":"ختم الفراعنة","palette":0,"frame":13,"photoShape":"diamond","art":2,"side":"right","backdrop":3,"plate":1,"font":"reem","artpos":"top"},
    {"id":26,"name":"رمال الذهب","palette":1,"frame":12,"photoShape":"round","art":17,"side":"right","backdrop":1,"plate":3,"font":"aref","artpos":"top"},
    {"id":27,"name":"مفتاح الحياة","palette":19,"frame":3,"photoShape":"arch","art":10,"side":"right","backdrop":4,"plate":4,"font":"cairo","artpos":"outer"},
    {"id":28,"name":"بردية المعارف","palette":9,"frame":17,"photoShape":"arch","art":15,"side":"right","backdrop":9,"plate":0,"font":"cairo","artpos":"outer"},
    {"id":29,"name":"ظل الأهرام","palette":14,"frame":17,"photoShape":"arch","art":17,"side":"left","backdrop":9,"plate":4,"font":"reem","artpos":"outer"},
    {"id":30,"name":"رواق المعابد","palette":19,"frame":7,"photoShape":"scallop","art":10,"side":"left","backdrop":7,"plate":0,"font":"reem","artpos":"near-photo"},
    {"id":31,"name":"خطوط المدينة","palette":17,"frame":9,"photoShape":"hex","art":16,"side":"right","backdrop":0,"plate":5,"font":"aref","artpos":"bottom"},
    {"id":32,"name":"شبكة المستقبل","palette":3,"frame":0,"photoShape":"shield","art":6,"side":"right","backdrop":3,"plate":0,"font":"cairo","artpos":"near-photo"},
    {"id":33,"name":"أفق أزرق","palette":2,"frame":16,"photoShape":"frame","art":19,"side":"right","backdrop":3,"plate":7,"font":"cairo","artpos":"near-photo"},
    {"id":34,"name":"موجة النجاح","palette":16,"frame":19,"photoShape":"diamond","art":0,"side":"left","backdrop":1,"plate":4,"font":"aref","artpos":"near-photo"},
    {"id":35,"name":"مربعات هندسية","palette":1,"frame":18,"photoShape":"diamond","art":4,"side":"right","backdrop":5,"plate":5,"font":"reem","artpos":"bottom"},
    {"id":36,"name":"تدرج الفجر","palette":10,"frame":1,"photoShape":"circle","art":16,"side":"right","backdrop":6,"plate":7,"font":"aref","artpos":"outer"},
    {"id":37,"name":"مسار الإنجاز","palette":12,"frame":2,"photoShape":"arch","art":8,"side":"left","backdrop":8,"plate":4,"font":"aref","artpos":"outer"},
    {"id":38,"name":"إطار معماري","palette":19,"frame":18,"photoShape":"book","art":7,"side":"right","backdrop":4,"plate":6,"font":"aref","artpos":"outer"},
    {"id":39,"name":"واجهة عصرية","palette":3,"frame":14,"photoShape":"hex","art":18,"side":"right","backdrop":0,"plate":4,"font":"reem","artpos":"bottom"},
    {"id":40,"name":"نبض رقمي","palette":13,"frame":1,"photoShape":"oval","art":1,"side":"right","backdrop":6,"plate":3,"font":"cairo","artpos":"outer"},
    {"id":41,"name":"غصن الزيتون","palette":15,"frame":10,"photoShape":"scallop","art":2,"side":"right","backdrop":5,"plate":3,"font":"aref","artpos":"bottom"},
    {"id":42,"name":"حديقة النجاح","palette":19,"frame":6,"photoShape":"book","art":18,"side":"right","backdrop":2,"plate":5,"font":"aref","artpos":"outer"},
    {"id":43,"name":"أوراق الربيع","palette":15,"frame":6,"photoShape":"scallop","art":0,"side":"left","backdrop":4,"plate":0,"font":"cairo","artpos":"outer"},
    {"id":44,"name":"زهرة الياسمين","palette":3,"frame":6,"photoShape":"shield","art":10,"side":"right","backdrop":6,"plate":7,"font":"reem","artpos":"outer"},
    {"id":45,"name":"ورود الأكاديمية","palette":9,"frame":12,"photoShape":"arch","art":15,"side":"left","backdrop":0,"plate":4,"font":"aref","artpos":"bottom"},
    {"id":46,"name":"تاج الغار","palette":17,"frame":12,"photoShape":"oval","art":12,"side":"left","backdrop":5,"plate":0,"font":"aref","artpos":"outer"},
    {"id":47,"name":"شمس الصباح","palette":14,"frame":1,"photoShape":"diamond","art":5,"side":"right","backdrop":2,"plate":7,"font":"aref","artpos":"near-photo"},
    {"id":48,"name":"غيمة البهجة","palette":3,"frame":0,"photoShape":"diamond","art":8,"side":"right","backdrop":1,"plate":6,"font":"reem","artpos":"top"},
    {"id":49,"name":"موج البحر","palette":13,"frame":13,"photoShape":"frame","art":15,"side":"left","backdrop":0,"plate":3,"font":"reem","artpos":"outer"},
    {"id":50,"name":"أطياف الغروب","palette":18,"frame":6,"photoShape":"round","art":17,"side":"right","backdrop":7,"plate":2,"font":"cairo","artpos":"near-photo"},
    {"id":51,"name":"نجوم صغار","palette":12,"frame":18,"photoShape":"hex","art":14,"side":"left","backdrop":5,"plate":0,"font":"reem","artpos":"outer"},
    {"id":52,"name":"بالونات الفرح","palette":14,"frame":9,"photoShape":"circle","art":17,"side":"left","backdrop":6,"plate":6,"font":"reem","artpos":"top"},
    {"id":53,"name":"قوس قزح","palette":9,"frame":1,"photoShape":"shield","art":2,"side":"left","backdrop":4,"plate":4,"font":"cairo","artpos":"top"},
    {"id":54,"name":"قطار الإنجاز","palette":15,"frame":1,"photoShape":"circle","art":2,"side":"left","backdrop":4,"plate":7,"font":"cairo","artpos":"bottom"},
    {"id":55,"name":"رحلة الفضاء","palette":2,"frame":11,"photoShape":"frame","art":10,"side":"right","backdrop":7,"plate":6,"font":"aref","artpos":"top"},
    {"id":56,"name":"فراشات النجاح","palette":4,"frame":2,"photoShape":"oval","art":6,"side":"left","backdrop":0,"plate":1,"font":"aref","artpos":"top"},
    {"id":57,"name":"كوكب الأبطال","palette":7,"frame":7,"photoShape":"shield","art":17,"side":"left","backdrop":4,"plate":5,"font":"reem","artpos":"outer"},
    {"id":58,"name":"ألوان الطيف","palette":9,"frame":18,"photoShape":"round","art":18,"side":"left","backdrop":9,"plate":3,"font":"cairo","artpos":"top"},
    {"id":59,"name":"سحابة التميّز","palette":17,"frame":14,"photoShape":"hex","art":5,"side":"left","backdrop":3,"plate":5,"font":"aref","artpos":"near-photo"},
    {"id":60,"name":"مغامرة المعرفة","palette":13,"frame":11,"photoShape":"round","art":1,"side":"left","backdrop":2,"plate":7,"font":"aref","artpos":"outer"},
    {"id":61,"name":"ذرة الاكتشاف","palette":8,"frame":17,"photoShape":"arch","art":5,"side":"left","backdrop":5,"plate":3,"font":"reem","artpos":"bottom"},
    {"id":62,"name":"مختبر التميّز","palette":3,"frame":12,"photoShape":"frame","art":16,"side":"left","backdrop":8,"plate":5,"font":"aref","artpos":"near-photo"},
    {"id":63,"name":"المجرة العلمية","palette":1,"frame":8,"photoShape":"hex","art":7,"side":"right","backdrop":5,"plate":3,"font":"cairo","artpos":"bottom"},
    {"id":64,"name":"مدار الإلكترون","palette":8,"frame":1,"photoShape":"circle","art":8,"side":"left","backdrop":3,"plate":7,"font":"aref","artpos":"near-photo"},
    {"id":65,"name":"مفتاح الابتكار","palette":3,"frame":18,"photoShape":"arch","art":15,"side":"right","backdrop":5,"plate":6,"font":"aref","artpos":"outer"},
    {"id":66,"name":"عالم الأرقام","palette":14,"frame":4,"photoShape":"diamond","art":4,"side":"left","backdrop":9,"plate":5,"font":"cairo","artpos":"top"},
    {"id":67,"name":"البوصلة الذكية","palette":13,"frame":6,"photoShape":"circle","art":6,"side":"left","backdrop":8,"plate":1,"font":"reem","artpos":"outer"},
    {"id":68,"name":"نافذة المستقبل","palette":19,"frame":11,"photoShape":"circle","art":1,"side":"right","backdrop":1,"plate":4,"font":"reem","artpos":"outer"},
    {"id":69,"name":"شبكة الخلايا","palette":0,"frame":7,"photoShape":"book","art":4,"side":"right","backdrop":4,"plate":1,"font":"reem","artpos":"bottom"},
    {"id":70,"name":"كيمياء النجاح","palette":4,"frame":7,"photoShape":"oval","art":9,"side":"right","backdrop":6,"plate":5,"font":"reem","artpos":"top"},
    {"id":71,"name":"ريشة الخط","palette":7,"frame":3,"photoShape":"book","art":19,"side":"left","backdrop":1,"plate":0,"font":"aref","artpos":"near-photo"},
    {"id":72,"name":"مسرح الإبداع","palette":10,"frame":3,"photoShape":"oval","art":15,"side":"right","backdrop":2,"plate":2,"font":"cairo","artpos":"top"},
    {"id":73,"name":"نوتة التفوق","palette":11,"frame":18,"photoShape":"frame","art":13,"side":"left","backdrop":7,"plate":1,"font":"aref","artpos":"top"},
    {"id":74,"name":"لوحة الفنان","palette":4,"frame":17,"photoShape":"hex","art":11,"side":"left","backdrop":6,"plate":7,"font":"aref","artpos":"outer"},
    {"id":75,"name":"حبر المعرفة","palette":5,"frame":15,"photoShape":"shield","art":19,"side":"left","backdrop":1,"plate":2,"font":"aref","artpos":"near-photo"},
    {"id":76,"name":"آلة الإلهام","palette":2,"frame":18,"photoShape":"frame","art":14,"side":"left","backdrop":2,"plate":4,"font":"aref","artpos":"bottom"},
    {"id":77,"name":"لون وحكاية","palette":2,"frame":8,"photoShape":"round","art":10,"side":"left","backdrop":2,"plate":5,"font":"cairo","artpos":"outer"},
    {"id":78,"name":"مخطوط الأدب","palette":6,"frame":13,"photoShape":"scallop","art":2,"side":"left","backdrop":6,"plate":0,"font":"cairo","artpos":"near-photo"},
    {"id":79,"name":"فرشاة النجاح","palette":3,"frame":13,"photoShape":"round","art":14,"side":"left","backdrop":2,"plate":0,"font":"cairo","artpos":"top"},
    {"id":80,"name":"أوتار الإنجاز","palette":1,"frame":12,"photoShape":"round","art":10,"side":"right","backdrop":0,"plate":4,"font":"cairo","artpos":"near-photo"},
    {"id":81,"name":"كأس البطل","palette":5,"frame":7,"photoShape":"frame","art":15,"side":"left","backdrop":0,"plate":1,"font":"reem","artpos":"outer"},
    {"id":82,"name":"درع الفريق","palette":1,"frame":1,"photoShape":"circle","art":5,"side":"right","backdrop":8,"plate":1,"font":"cairo","artpos":"bottom"},
    {"id":83,"name":"مضمار التميّز","palette":15,"frame":0,"photoShape":"circle","art":1,"side":"right","backdrop":5,"plate":3,"font":"reem","artpos":"outer"},
    {"id":84,"name":"شعلة الفوز","palette":16,"frame":13,"photoShape":"hex","art":10,"side":"right","backdrop":9,"plate":2,"font":"aref","artpos":"near-photo"},
    {"id":85,"name":"كرة الأبطال","palette":15,"frame":17,"photoShape":"arch","art":18,"side":"right","backdrop":9,"plate":7,"font":"aref","artpos":"outer"},
    {"id":86,"name":"ميدالية ذهبية","palette":7,"frame":15,"photoShape":"circle","art":16,"side":"right","backdrop":3,"plate":3,"font":"aref","artpos":"top"},
    {"id":87,"name":"راية الفريق","palette":7,"frame":10,"photoShape":"hex","art":16,"side":"right","backdrop":1,"plate":0,"font":"aref","artpos":"bottom"},
    {"id":88,"name":"خط النهاية","palette":4,"frame":13,"photoShape":"circle","art":11,"side":"left","backdrop":2,"plate":6,"font":"aref","artpos":"bottom"},
    {"id":89,"name":"نجم الملاعب","palette":17,"frame":1,"photoShape":"diamond","art":3,"side":"right","backdrop":8,"plate":7,"font":"aref","artpos":"top"},
    {"id":90,"name":"إرادة وانتصار","palette":5,"frame":3,"photoShape":"round","art":17,"side":"left","backdrop":1,"plate":1,"font":"reem","artpos":"top"},
    {"id":91,"name":"رونق الخط العربي","palette":0,"frame":12,"photoShape":"oval","art":5,"side":"left","backdrop":1,"plate":6,"font":"aref","artpos":"top"},
    {"id":92,"name":"ديوان الحكمة","palette":2,"frame":11,"photoShape":"shield","art":17,"side":"right","backdrop":4,"plate":7,"font":"reem","artpos":"bottom"},
    {"id":93,"name":"محبرة الشكر","palette":18,"frame":12,"photoShape":"round","art":14,"side":"left","backdrop":6,"plate":3,"font":"aref","artpos":"top"},
    {"id":94,"name":"مئذنة العلم","palette":6,"frame":13,"photoShape":"diamond","art":16,"side":"right","backdrop":9,"plate":7,"font":"aref","artpos":"bottom"},
    {"id":95,"name":"قبة المعارف","palette":19,"frame":19,"photoShape":"round","art":4,"side":"right","backdrop":0,"plate":2,"font":"cairo","artpos":"bottom"},
    {"id":96,"name":"عقد النجاح","palette":4,"frame":2,"photoShape":"scallop","art":19,"side":"right","backdrop":5,"plate":7,"font":"aref","artpos":"top"},
    {"id":97,"name":"بوابة التميّز","palette":12,"frame":13,"photoShape":"frame","art":8,"side":"right","backdrop":6,"plate":5,"font":"aref","artpos":"outer"},
    {"id":98,"name":"مشكاة العلم","palette":0,"frame":16,"photoShape":"arch","art":9,"side":"left","backdrop":9,"plate":1,"font":"aref","artpos":"near-photo"},
    {"id":99,"name":"تذكار الوفاء","palette":1,"frame":3,"photoShape":"oval","art":4,"side":"left","backdrop":1,"plate":3,"font":"aref","artpos":"bottom"},
    {"id":100,"name":"إشراقة القلم","palette":1,"frame":17,"photoShape":"frame","art":12,"side":"right","backdrop":6,"plate":0,"font":"reem","artpos":"near-photo"}
  ];
  const TEMPLATES = TEMPLATE_SPECS.map(t => ({...t, palette: PALETTES[t.palette]}));
  const PHOTO_SHAPES = ["arch","oval","shield","diamond","hex","round","scallop","book","circle","frame"];
  const FRAME_RULES = [
    {o:"inset:8mm;border:1mm double var(--tpl-accent);box-shadow:inset 0 0 0 1.5mm var(--tpl-paper),inset 0 0 0 1.8mm var(--tpl-accent)",i:"inset:12mm;border:.35mm solid var(--tpl-accent);opacity:.65",a:"top:12mm;bottom:auto;height:1.2mm;border:0;background:linear-gradient(90deg,transparent,var(--tpl-accent),transparent)",b:"bottom:12mm;top:auto;height:1.2mm;border:0;background:linear-gradient(90deg,transparent,var(--tpl-accent),transparent)"},
    {o:"inset:8mm;border:.6mm solid var(--tpl-accent);border-radius:1mm 12mm 1mm 12mm",i:"inset:12mm;border:.35mm dashed var(--tpl-accent);border-radius:1mm 9mm 1mm 9mm;opacity:.7",a:"left:14mm;right:auto;top:14mm;width:22mm;height:3mm;border:0;background:var(--tpl-accent)",b:"right:14mm;left:auto;bottom:14mm;width:22mm;height:3mm;border:0;background:var(--tpl-accent)"},
    {o:"inset:8mm;border:1mm solid var(--tpl-accent);clip-path:polygon(0 0,45% 0,50% 5%,55% 0,100% 0,100% 45%,96% 50%,100% 55%,100% 100%,55% 100%,50% 96%,45% 100%,0 100%,0 55%,4% 50%,0 45%)",i:"inset:13mm;border:.3mm solid var(--tpl-accent);opacity:.6",a:"top:11mm;left:50%;right:auto;width:14mm;height:14mm;border:1mm double var(--tpl-accent);border-radius:50%;transform:translateX(-50%)",b:"bottom:11mm;left:50%;right:auto;width:24mm;height:1mm;border:0;background:var(--tpl-accent);transform:translateX(-50%)"},
    {o:"inset:8mm;border:2mm solid transparent;background:linear-gradient(var(--tpl-paper),var(--tpl-paper)) padding-box,repeating-linear-gradient(45deg,var(--tpl-accent) 0 1mm,transparent 1mm 2mm) border-box",i:"inset:13mm;border-inline:1mm solid var(--tpl-accent);opacity:.6",a:"left:12mm;right:12mm;top:12mm;height:3mm;border:0;background:repeating-linear-gradient(90deg,var(--tpl-accent) 0 1mm,transparent 1mm 3mm)",b:"left:12mm;right:12mm;bottom:12mm;height:3mm;border:0;background:repeating-linear-gradient(90deg,var(--tpl-accent) 0 1mm,transparent 1mm 3mm)"},
    {o:"inset:8mm;border:.8mm solid var(--tpl-accent);border-radius:28mm 2mm 28mm 2mm",i:"inset:13mm;border:.35mm solid var(--tpl-accent);border-radius:22mm 1mm 22mm 1mm;opacity:.55",a:"left:16mm;right:16mm;top:13mm;height:4mm;border:0;background:radial-gradient(ellipse,var(--tpl-accent) 0 20%,transparent 22%) 0 0/7mm 4mm",b:"left:16mm;right:16mm;bottom:13mm;height:4mm;border:0;background:radial-gradient(ellipse,var(--tpl-accent) 0 20%,transparent 22%) 0 0/7mm 4mm"},
    {o:"inset:8mm;border:.8mm solid var(--tpl-accent);border-radius:50% 50% 3mm 3mm / 18% 18% 3mm 3mm",i:"inset:13mm 15mm;border:.35mm solid var(--tpl-accent);border-radius:50% 50% 2mm 2mm / 18% 18% 2mm 2mm;opacity:.6",a:"top:12mm;left:20mm;right:20mm;height:1mm;border:0;background:var(--tpl-accent)",b:"bottom:12mm;left:20mm;right:20mm;height:1mm;border:0;background:var(--tpl-accent)"},
    {o:"inset:0 0 auto;height:18mm;background:var(--tpl-deep);border:0",i:"inset:18mm 8mm 8mm;border:.5mm solid var(--tpl-accent);border-top:0",a:"top:17mm;left:0;right:0;height:1.2mm;border:0;background:var(--tpl-accent)",b:"bottom:0;left:0;right:0;height:7mm;background:var(--tpl-deep);border:0"},
    {o:"inset:8mm;border:1mm solid var(--tpl-accent);transform:rotate(0deg)",i:"inset:13mm;border:.35mm dashed var(--tpl-accent);opacity:.55",a:"top:9mm;left:50%;right:auto;width:15mm;height:15mm;border:1mm solid var(--tpl-accent);transform:translateX(-50%) rotate(45deg)",b:"bottom:9mm;left:50%;right:auto;width:15mm;height:15mm;border:1mm solid var(--tpl-accent);transform:translateX(-50%) rotate(45deg)"},
    {o:"inset:7mm;border-inline:1.4mm solid var(--tpl-accent);border-block:.35mm solid var(--tpl-accent)",i:"inset:11mm;border-inline:.35mm solid var(--tpl-deep);border-block:0;opacity:.7",a:"left:12mm;right:12mm;top:10mm;height:2mm;border:0;background:linear-gradient(90deg,var(--tpl-accent),transparent 20% 80%,var(--tpl-accent))",b:"left:12mm;right:12mm;bottom:10mm;height:2mm;border:0;background:linear-gradient(90deg,var(--tpl-accent),transparent 20% 80%,var(--tpl-accent))"},
    {o:"inset:8mm;border:1.2mm dotted var(--tpl-accent);border-radius:5mm",i:"inset:13mm;border:.35mm solid var(--tpl-accent);border-radius:3mm;opacity:.55",a:"top:12mm;left:15mm;right:15mm;height:3mm;border:0;background:repeating-linear-gradient(135deg,var(--tpl-accent) 0 1mm,transparent 1mm 4mm)",b:"bottom:12mm;left:15mm;right:15mm;height:3mm;border:0;background:repeating-linear-gradient(135deg,var(--tpl-accent) 0 1mm,transparent 1mm 4mm)"},
    {o:"inset:8mm;border:1mm solid var(--tpl-accent);box-shadow:0 0 0 2mm var(--tpl-paper),0 0 0 2.5mm var(--tpl-accent)",i:"inset:15mm;border:.25mm solid var(--tpl-accent);opacity:.5",a:"top:13mm;left:50%;right:auto;width:26mm;height:5mm;transform:translateX(-50%);border:0;background:var(--tpl-accent);border-radius:0 0 8mm 8mm",b:"bottom:13mm;left:50%;right:auto;width:26mm;height:5mm;transform:translateX(-50%);border:0;background:var(--tpl-accent);border-radius:8mm 8mm 0 0"},
    {o:"inset:8mm;border:1mm solid var(--tpl-deep);border-radius:0",i:"inset:11mm;border:.6mm solid var(--tpl-accent);border-radius:0;opacity:.85",a:"left:0;right:0;top:0;height:5mm;border:0;background:linear-gradient(90deg,var(--tpl-deep),var(--tpl-accent),var(--tpl-deep))",b:"left:0;right:0;bottom:0;height:5mm;border:0;background:linear-gradient(90deg,var(--tpl-deep),var(--tpl-accent),var(--tpl-deep))"},
    {o:"inset:9mm;border:.7mm solid var(--tpl-accent);border-radius:18mm 18mm 2mm 2mm",i:"inset:14mm;border:.3mm solid var(--tpl-accent);border-radius:13mm 13mm 1mm 1mm;opacity:.5",a:"top:12mm;left:50%;right:auto;width:12mm;height:12mm;border:.8mm solid var(--tpl-accent);border-radius:50%;transform:translateX(-50%)",b:"bottom:12mm;left:50%;right:auto;width:12mm;height:12mm;border:.8mm solid var(--tpl-accent);border-radius:50%;transform:translateX(-50%)"},
    {o:"inset:7mm;border:1mm solid var(--tpl-accent);border-radius:3mm 16mm 3mm 16mm",i:"inset:12mm;border:.3mm dashed var(--tpl-deep);border-radius:2mm 12mm 2mm 12mm;opacity:.55",a:"left:14mm;right:14mm;top:11mm;height:2mm;border:0;background:radial-gradient(circle,var(--tpl-accent) 0 1mm,transparent 1.2mm) 0 0/6mm 2mm",b:"left:14mm;right:14mm;bottom:11mm;height:2mm;border:0;background:radial-gradient(circle,var(--tpl-accent) 0 1mm,transparent 1.2mm) 0 0/6mm 2mm"},
    {o:"inset:8mm;border:.6mm solid var(--tpl-accent);border-radius:1mm",i:"inset:12mm;border-inline:1.2mm solid var(--tpl-deep);border-block:0;opacity:.65",a:"left:12mm;right:12mm;top:12mm;height:1mm;border:0;background:linear-gradient(90deg,transparent,var(--tpl-accent) 20% 80%,transparent)",b:"left:12mm;right:12mm;bottom:12mm;height:1mm;border:0;background:linear-gradient(90deg,transparent,var(--tpl-accent) 20% 80%,transparent)"},
    {o:"inset:8mm;border:.8mm solid var(--tpl-accent);clip-path:polygon(0 0,100% 0,100% 100%,5% 100%,0 95%)",i:"inset:12mm;border:.35mm solid var(--tpl-deep);opacity:.55",a:"top:8mm;left:8mm;right:8mm;height:4mm;border:0;background:repeating-linear-gradient(45deg,var(--tpl-accent) 0 1.5mm,transparent 1.5mm 4mm)",b:"bottom:8mm;left:8mm;right:8mm;height:4mm;border:0;background:repeating-linear-gradient(45deg,var(--tpl-accent) 0 1.5mm,transparent 1.5mm 4mm)"},
    {o:"inset:8mm;border:1mm solid var(--tpl-accent);border-radius:24mm 2mm 24mm 2mm",i:"inset:13mm;border:.3mm solid var(--tpl-deep);border-radius:18mm 1mm 18mm 1mm;opacity:.5",a:"top:12mm;left:12mm;right:12mm;height:2mm;border:0;background:linear-gradient(90deg,var(--tpl-accent),transparent 30% 70%,var(--tpl-accent))",b:"bottom:12mm;left:12mm;right:12mm;height:2mm;border:0;background:linear-gradient(90deg,var(--tpl-accent),transparent 30% 70%,var(--tpl-accent))"},
    {o:"inset:7mm;border:1.3mm solid var(--tpl-accent);border-radius:2mm",i:"inset:10mm;border:.4mm solid var(--tpl-deep);border-radius:1mm;opacity:.8",a:"left:10mm;right:10mm;top:10mm;height:1mm;border:0;background:var(--tpl-accent)",b:"left:10mm;right:10mm;bottom:10mm;height:1mm;border:0;background:var(--tpl-accent)"},
    {o:"inset:9mm;border:.6mm solid var(--tpl-accent);border-radius:50% 50% 4mm 4mm / 22% 22% 4mm 4mm",i:"inset:14mm;border:.3mm dashed var(--tpl-accent);border-radius:50% 50% 2mm 2mm / 22% 22% 2mm 2mm;opacity:.55",a:"top:11mm;left:50%;right:auto;width:30mm;height:1mm;transform:translateX(-50%);border:0;background:var(--tpl-accent)",b:"bottom:11mm;left:50%;right:auto;width:30mm;height:1mm;transform:translateX(-50%);border:0;background:var(--tpl-accent)"},
    {o:"inset:8mm;border:.8mm solid var(--tpl-accent);border-radius:4mm 16mm 4mm 16mm;box-shadow:inset 0 0 0 1.5mm var(--tpl-paper),inset 0 0 0 1.9mm var(--tpl-deep)",i:"inset:14mm;border:.35mm solid var(--tpl-accent);border-radius:2mm 10mm 2mm 10mm;opacity:.6",a:"top:12mm;left:12mm;right:12mm;height:2mm;border:0;background:linear-gradient(90deg,var(--tpl-deep),var(--tpl-accent),var(--tpl-deep))",b:"bottom:12mm;left:12mm;right:12mm;height:2mm;border:0;background:linear-gradient(90deg,var(--tpl-deep),var(--tpl-accent),var(--tpl-deep))"}
  ];
  const PHOTO_CLIPS = {
    arch:"border-radius:50% 50% 4mm 4mm / 24% 24% 4mm 4mm",
    oval:"border-radius:50%",
    shield:"clip-path:polygon(50% 0,94% 18%,84% 75%,50% 100%,16% 75%,6% 18%)",
    diamond:"clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)",
    hex:"clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)",
    round:"border-radius:12mm",
    scallop:"clip-path:polygon(50% 0,61% 5%,75% 3%,83% 13%,97% 20%,93% 35%,100% 50%,93% 65%,97% 80%,83% 87%,75% 97%,61% 95%,50% 100%,39% 95%,25% 97%,17% 87%,3% 80%,7% 65%,0 50%,7% 35%,3% 20%,17% 13%,25% 3%,39% 5%)",
    book:"clip-path:polygon(0 0,50% 8%,100% 0,100% 92%,50% 100%,0 92%)",
    circle:"border-radius:50%",
    frame:"border-radius:2mm"
  };
  const NAME_PLATES = [
    "border-radius:50mm;border:1mm solid var(--tpl-accent)",
    "border-radius:2mm;border-block:.7mm solid var(--tpl-accent);background:transparent!important;box-shadow:none!important",
    "border-radius:1mm 12mm 1mm 12mm;border:1mm solid var(--tpl-accent)",
    "border-radius:0;border:0;border-bottom:1mm solid var(--tpl-accent);background:transparent!important;box-shadow:none!important",
    "border-radius:2mm;background:var(--tpl-deep)!important;color:var(--tpl-paper)!important;border:0",
    "border-radius:2mm 2mm 12mm 12mm;border:1mm double var(--tpl-accent)",
    "border-radius:50%;border:.8mm dashed var(--tpl-accent);box-shadow:none!important",
    "border-radius:0;border-inline:1mm solid var(--tpl-accent);background:transparent!important;box-shadow:none!important"
  ];
  const TITLE_MARKS = [
    "width:46mm;height:1.2mm;background:linear-gradient(90deg,transparent,var(--tpl-accent),transparent)",
    "width:28mm;height:1.2mm;background:var(--tpl-accent)",
    "width:52mm;height:.5mm;background:repeating-linear-gradient(90deg,var(--tpl-accent) 0 2mm,transparent 2mm 4mm)",
    "width:38mm;height:1.5mm;background:linear-gradient(90deg,var(--tpl-deep),var(--tpl-accent),var(--tpl-deep))",
    "width:20mm;height:2mm;background:var(--tpl-accent);border-radius:50%",
    "width:44mm;height:.6mm;background:var(--tpl-deep)",
    "width:36mm;height:1mm;background:var(--tpl-accent);box-shadow:0 1mm 0 rgba(0,0,0,.08)",
    "width:48mm;height:1mm;background:linear-gradient(90deg,transparent,var(--tpl-accent) 25% 75%,transparent)"
  ];
  const ART = [
    "<path d='M15 72 8 28l23 18L50 12l19 34 23-18-8 44zM20 84h60'/>",
    "<path d='M50 10 61 38l29 2-22 19 7 29-25-15-25 15 7-29L10 40l29-2z'/>",
    "<path d='M18 84Q8 60 20 35M82 84Q92 60 80 35M22 70l17 4M20 55l20 4M24 40l17 5M78 70l-17 4M80 55l-20 4M76 40l-17 5M40 83h20'/>",
    "<path d='M20 35h60v48H20zM30 45h40M30 57h32M30 69h24M50 35v48'/>",
    "<path d='M15 38 50 18l35 20-35 20zM28 49v20q22 17 44 0V49M84 38v25'/>",
    "<path d='M20 76h60l-6-31H26zM30 45l20-24 20 24M35 58h30M39 69h22'/>",
    "<circle cx='50' cy='48' r='29'/><path d='M21 48h58M50 19c-16 17-16 41 0 58M50 19c16 17 16 41 0 58M28 30h44M28 66h44'/>",
    "<ellipse cx='50' cy='50' rx='39' ry='16'/><ellipse cx='50' cy='50' rx='39' ry='16' transform='rotate(60 50 50)'/><ellipse cx='50' cy='50' rx='39' ry='16' transform='rotate(120 50 50)'/><circle cx='50' cy='50' r='5'/>",
    "<path d='M24 82 50 23l26 59zM34 62h32M42 44h16M17 84h66'/>",
    "<path d='M50 84C9 69 20 38 50 51c30-13 41 18 0 33zM50 51V22M50 34c-14-18-27-4 0 5M50 39c14-18 27-4 0 5'/>",
    "<circle cx='50' cy='50' r='12'/><path d='M50 8v15M50 77v15M8 50h15M77 50h15M20 20l11 11M69 69l11 11M80 20 69 31M31 69 20 80'/>",
    "<path d='M20 68q30-38 60 0M25 69v12h50V69M35 67l15-20 15 20M38 82v7M62 82v7'/>",
    "<path d='M18 22h64v58H18zM29 34h42M29 47h42M29 60h28M29 70h34'/>",
    "<path d='M50 14 84 34v32L50 86 16 66V34zM50 14v72M16 34l68 32M84 34 16 66'/>",
    "<path d='M30 82q-7-20 2-39l18-27 18 27q9 19 2 39zM38 52h24M43 67h14M50 16v-8'/>",
    "<path d='M18 18q32 17 64 0v57q-32-17-64 0zM24 29q26 13 52 0M24 44q26 13 52 0M24 59q26 13 52 0'/>",
    "<path d='M23 80 69 20l9 7-46 60-12 5zM64 27l9 7M16 88l10-3'/>",
    "<path d='M20 20q30 12 60 0v15q-30 12-60 0zM20 65q30 12 60 0v15q-30 12-60 0zM27 39v21M73 39v21'/>",
    "<path d='M50 12 60 38l28 2-22 18 7 28-23-15-23 15 7-28-22-18 28-2zM20 88h60'/>",
    "<path d='M19 76 80 26M25 81l-8-8M74 21l8 8M32 69l-8-8M44 60l-8-8M55 51l-8-8M66 42l-8-8'/>"
  ];
  const iconSvg = (key, color) => `<svg viewBox="0 0 100 100" aria-hidden="true" style="color:${color || 'currentColor'}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${ART[key % ART.length]}</svg>`;
  const BACKGROUNDS = [
    "var(--tpl-paper)",
    "radial-gradient(ellipse at 50% 0,rgba(255,255,255,.52),transparent 55%),var(--tpl-paper)",
    "linear-gradient(135deg,var(--tpl-paper) 76%,var(--tpl-accent) 76% 77%,var(--tpl-paper) 77%)",
    "linear-gradient(90deg,var(--tpl-deep) 0 3%,var(--tpl-paper) 3% 97%,var(--tpl-accent) 97% 98%,var(--tpl-paper) 98%)",
    "radial-gradient(circle at 100% 0,rgba(255,255,255,.45),transparent 40%),var(--tpl-paper)",
    "repeating-linear-gradient(0deg,var(--tpl-paper) 0 24mm,rgba(120,100,70,.035) 24mm 25mm)",
    "radial-gradient(ellipse at 0 100%,rgba(180,150,95,.15),transparent 42%),var(--tpl-paper)",
    "linear-gradient(155deg,var(--tpl-paper) 0 84%,var(--tpl-accent) 84% 85%,var(--tpl-paper) 85%)",
    "radial-gradient(ellipse at center,rgba(255,255,255,.45),transparent 68%),var(--tpl-paper)",
    "linear-gradient(25deg,var(--tpl-deep) 0 2%,var(--tpl-paper) 2% 98%,var(--tpl-deep) 98%)"
  ];
  const tplCss = `
  .cert.gallery{--ink:var(--tpl-ink);--title:var(--tpl-accent);--soft:var(--tpl-soft);--plate:var(--tpl-paper);--plateInk:var(--tpl-ink);--accent:var(--tpl-accent);background:var(--tpl-paper)}
  .cert.gallery .bg{background:var(--tpl-paper)}
  .cert.gallery .bg::before,.cert.gallery .bg::after{content:"";position:absolute;pointer-events:none}
  .cert.gallery .deco::before,.cert.gallery .deco::after{content:"";position:absolute;pointer-events:none}
  .cert.gallery .t{font-family:var(--tf);font-size:var(--tz);color:var(--tpl-accent);background:none;-webkit-text-fill-color:currentColor;text-shadow:none;position:relative}
  .cert.gallery .n{color:var(--tpl-ink);background:var(--tpl-paper);box-shadow:none;position:relative}
  .cert.gallery .pic.photo-arch{border-radius:50% 50% 4mm 4mm / 24% 24% 4mm 4mm}
  .cert.gallery .pic.photo-oval,.cert.gallery .pic.photo-circle{border-radius:50%}
  .cert.gallery .pic.photo-shield{clip-path:polygon(50% 0,94% 18%,84% 75%,50% 100%,16% 75%,6% 18%)}
  .cert.gallery .pic.photo-diamond{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
  .cert.gallery .pic.photo-hex{clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)}
  .cert.gallery .pic.photo-round{border-radius:12mm}
  .cert.gallery .pic.photo-scallop{clip-path:polygon(50% 0,61% 5%,75% 3%,83% 13%,97% 20%,93% 35%,100% 50%,93% 65%,97% 80%,83% 87%,75% 97%,61% 95%,50% 100%,39% 95%,25% 97%,17% 87%,3% 80%,7% 65%,0 50%,7% 35%,3% 20%,17% 13%,25% 3%,39% 5%)}
  .cert.gallery .pic.photo-book{clip-path:polygon(0 0,50% 8%,100% 0,100% 92%,50% 100%,0 92%)}
  .tpl-gallery{margin:0 0 16px;border:1px solid #dfe4ef;border-radius:14px;padding:12px;background:#fbfcff}
  .tpl-gallery summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;font-weight:800;color:#182543}
  .tpl-gallery summary::-webkit-details-marker{display:none}.tpl-gallery summary span{font-size:.8rem;color:#64718a;font-weight:600}
  .tpl-tools{margin:10px 0}.tpl-tools input{width:100%;padding:9px 10px;border:1px solid #dce2ed;border-radius:9px;font:inherit}
  .tpl-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;max-height:430px;overflow:auto;padding:2px}
  .tpl-card{cursor:pointer;border:1px solid #dce2ed;border-radius:9px;padding:5px;background:white;text-align:center;min-width:0}
  .tpl-card:hover,.tpl-card.selected{border-color:#bd943e;box-shadow:0 0 0 2px rgba(189,148,62,.2)}
  .tpl-mini{height:58px;position:relative;overflow:hidden;border-radius:4px;display:flex;background:var(--tpl-paper);color:var(--tpl-ink);border:1px solid rgba(0,0,0,.12)}
  .tpl-mini::before,.tpl-mini::after{content:"";position:absolute;inset:3px;pointer-events:none;z-index:2}
  .tpl-mini::before{border:1px solid var(--tpl-accent)}.tpl-mini::after{inset:auto 5px 5px;height:1px;background:var(--tpl-accent)}
  .tpl-number{position:absolute;z-index:4;right:4px;top:3px;min-width:14px;padding:1px 3px;border-radius:8px;background:var(--tpl-deep);color:var(--tpl-paper);font:700 7px/1.2 Arial,sans-serif;box-shadow:0 1px 2px #0003}
  .tpl-mini-photo{position:relative;z-index:1;width:38%;margin:5px 3px;background-image:var(--teacher-photo,linear-gradient(145deg,#d9e3ed,#94a4b8));background-size:cover;background-position:center;flex:none}
  .tpl-grid[data-has-photo="no"] .tpl-mini-photo::before{content:"";position:absolute;left:36%;top:12%;width:28%;aspect-ratio:1;border-radius:50%;background:#fff;opacity:.82}
  .tpl-grid[data-has-photo="no"] .tpl-mini-photo::after{content:"";position:absolute;left:18%;right:18%;bottom:0;height:48%;border-radius:60% 60% 0 0;background:#fff;opacity:.82}
  .tpl-mini[data-side="right"] .tpl-mini-photo{order:2}
  .tpl-mini-photo[data-photo="arch"]{border-radius:50% 50% 3px 3px}.tpl-mini-photo[data-photo="oval"],.tpl-mini-photo[data-photo="circle"]{border-radius:50%}
  .tpl-mini-photo[data-photo="shield"]{clip-path:polygon(50% 0,100% 18%,82% 78%,50% 100%,18% 78%,0 18%)}
  .tpl-mini-photo[data-photo="diamond"]{clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
  .tpl-mini-photo[data-photo="hex"]{clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)}
  .tpl-mini-photo[data-photo="round"]{border-radius:10px}.tpl-mini-photo[data-photo="scallop"]{clip-path:polygon(50% 0,70% 8%,100% 0,92% 50%,100% 100%,70% 92%,50% 100%,30% 92%,0 100%,8% 50%,0 0,30% 8%)}
  .tpl-mini-copy{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;padding:3px}
  .tpl-mini-copy b{font-size:7px;line-height:1.2;color:var(--tpl-accent);white-space:nowrap}.tpl-mini-copy i{width:70%;height:1px;background:var(--tpl-ink);opacity:.28;margin-top:4px}
  .tpl-mini-art{position:absolute;left:2px;top:2px;width:15px;height:15px;opacity:.65}.tpl-mini-art svg{width:100%;height:100%}
  .tpl-label{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;min-height:23px;font-size:10px;line-height:1.2;margin-top:4px;overflow:hidden;color:#35425a}
  ` + TEMPLATES.map(t => {
    const f=FRAME_RULES[t.frame], p=t.palette;
    return `.cert.tpl-${t.id}{--tpl-paper:${p.paper};--tpl-deep:${p.deep};--tpl-accent:${p.accent};--tpl-ink:${p.ink};--tpl-soft:${p.soft}}
.cert.tpl-${t.id} .bg{background:${BACKGROUNDS[t.backdrop]}}
.cert.tpl-${t.id} .bg::before{${f.o}}
.cert.tpl-${t.id} .bg::after{${f.i}}
.cert.tpl-${t.id} .deco::before{${f.a}}
.cert.tpl-${t.id} .deco::after{${f.b}}
.cert.tpl-${t.id} .t::after{${TITLE_MARKS[t.frame%TITLE_MARKS.length]};margin:2.2mm auto 0}
.cert.tpl-${t.id} .n{${NAME_PLATES[t.plate]}}
.cert.tpl-${t.id} .pic.frame{border-color:var(--tpl-accent);box-shadow:0 2mm 7mm rgba(0,0,0,.25),0 0 0 1mm var(--tpl-paper),0 0 0 1.5mm var(--tpl-accent)}
.cert.tpl-${t.id} .tpl-illustration{color:${p.accent}}
.tpl-mini[data-template="${t.id}"]{background:${BACKGROUNDS[t.backdrop]}}
.tpl-mini[data-template="${t.id}"]::before{${f.o.replaceAll('inset:8mm','inset:3px').replaceAll('inset:7mm','inset:3px').replaceAll('inset:9mm','inset:3px').replaceAll('inset:0 0 auto;height:18mm','inset:0 0 auto;height:8px').replaceAll('border:1mm','border:1px').replaceAll('border:.8mm','border:1px').replaceAll('border:.6mm','border:1px').replaceAll('border:1.2mm','border:1px').replaceAll('border:1.3mm','border:1px').replaceAll('border:2mm','border:1px')}}
.tpl-mini[data-template="${t.id}"] .tpl-mini-photo{border:1px solid ${p.accent}}
`;
  }).join("") + `
  .tpl-illustration{position:absolute;z-index:1;width:30mm;height:30mm;opacity:.19;pointer-events:none;color:var(--tpl-accent)}
  .tpl-illustration svg{width:100%;height:100%}
  .cert-copybox{grid-column:1/-1;background:linear-gradient(145deg,#fff,#f7f9fc);border:1px solid #dce3ee;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(31,49,82,.05)}
  .cert-copybox textarea{font-family:'Cairo','IBM Plex Sans Arabic',sans-serif;direction:rtl;line-height:1.8;min-height:126px;resize:vertical}
  .cert-copytoolbar{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
  .cert-copytoolbar label{display:block}.cert-copyhint{font-size:11px;line-height:1.7;color:#64718a;margin-top:8px}
  .cert-copyhead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;color:#263653}
  .cert-copycount{white-space:nowrap;font-size:11px;color:#71809a}
  @media(max-width:520px){.cert-copytoolbar{grid-template-columns:1fr}}
  .tpl-illustration[data-side="left"]{right:13mm;top:12mm}
  .tpl-illustration[data-side="right"]{left:13mm;top:12mm}
  .tpl-illustration[data-side="top"]{right:12mm;bottom:13mm}
  .tpl-illustration[data-side="bottom"]{right:12mm;top:13mm}
  .tpl-illustration[data-position="bottom"]{top:auto;bottom:13mm}
  .tpl-illustration[data-position="near-photo"][data-side="left"]{left:143mm;right:auto}
  .tpl-illustration[data-position="near-photo"][data-side="right"]{right:140mm;left:auto}
  .cert.port .tpl-illustration[data-position="near-photo"]{left:auto;right:12mm;top:50%;bottom:auto}
  .cert.port .tpl-illustration[data-position="bottom"]{top:auto;bottom:13mm}
  `;
  const PMODES = [["frame", "إطار"], ["fit", "كاملة"], ["cut", "مقصوصة"], ["off", "بدون"]];
  const shp = k => SHAPES.find(s => s[0] === k) || SHAPES[0];
  const FONTS = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Reem+Kufi:wght@500;700&family=Aref+Ruqaa:wght@700&display=swap";

  const ccss = `
  .cert{position:relative;overflow:hidden;page-break-after:always;direction:rtl;text-align:center;font-family:'Cairo','IBM Plex Sans Arabic','Segoe UI',Tahoma,sans-serif;color:var(--ink);background:#fff;
    --ink:#222;--title:#222;--accent:#c98412;--soft:#666;--plate:#fff;--plateInk:#222;--pb:0 solid transparent;--pr:50mm;--tf:'Reem Kufi','Cairo',sans-serif}
  .cert .bg,.cert .deco{position:absolute;inset:0;pointer-events:none}
  .cert .bg::before,.cert .bg::after,.cert .deco::before,.cert .deco::after{content:"";position:absolute}
  .cert .main{position:absolute;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .cert .pic{position:absolute;z-index:2}
  .cert .pic img{display:block;width:100%;height:100%}
  .cert .pic.frame{border-radius:5mm;overflow:hidden;border:1.4mm solid var(--accent);box-shadow:0 2.5mm 7mm rgba(0,0,0,.28)}
  .cert .pic.frame img{object-fit:cover;object-position:50% var(--py,18%)}
  .cert .pic.fit img{object-fit:contain;background:var(--tpl-paper,#fff)}
  .cert .pic.cut::before{content:"";position:absolute;left:-6%;right:-6%;top:14%;bottom:0;border-radius:50%;background:radial-gradient(closest-side,var(--accent),transparent 72%);opacity:.38}
  .cert .pic.cut img{position:relative;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 2mm 3mm rgba(0,0,0,.4))}
  .cert .pic.circle.depth{transform:perspective(500px) rotateY(-5deg);box-shadow:0 1mm 0 #8a692e,0 2mm 0 #d5c08b,0 4mm 7mm rgba(0,0,0,.35)}
  .cert .pic.circle{position:relative;flex:none;width:34mm;height:34mm;border-radius:50%;overflow:hidden;border:1mm solid var(--accent);margin-bottom:3mm;box-shadow:0 1mm 3mm rgba(0,0,0,.25)}
  .cert .pic.circle img{object-fit:cover;object-position:50% 20%}
  .cert .lg{height:15mm;margin-bottom:3mm;flex:none}
  .cert .t{font-family:var(--tf);font-size:var(--tz);font-weight:700;line-height:1.3;color:var(--title)}
  .cert .t::after{content:"";display:block;width:42mm;height:.9mm;margin:2.5mm auto 0;background:linear-gradient(90deg,transparent,var(--accent),transparent)}
  .cert .k{font-size:calc(var(--bz) - 1.5pt);color:var(--soft);margin-top:3mm;font-weight:600}
  .cert .n{display:inline-block;max-width:100%;margin:2.5mm 0 3.5mm;padding:2.2mm 13mm;border-radius:var(--pr);background:var(--plate);color:var(--plateInk);border:var(--pb);font-size:calc(var(--nz)*var(--ns,1));font-weight:800;line-height:1.5;box-shadow:0 1.5mm 4mm rgba(0,0,0,.22)}
  .cert .b{font-size:var(--bsize,var(--bz));line-height:1.75;font-weight:500;max-width:100%;text-align:var(--balign,center);white-space:pre-line;color:var(--soft)}
  .cert .ft{display:flex;justify-content:space-between;align-items:flex-end;width:100%;margin-top:var(--fm);font-size:var(--fz)}
  .cert .sg,.cert .sp{min-width:var(--sw);flex:none}
  .cert .sg{border-top:.35mm solid var(--accent);padding-top:1.8mm;font-weight:700}
  .cert .sg small{display:block;font-weight:500;opacity:.8;font-size:.88em}
  .cert .dt{font-weight:600;opacity:.9}
  .cert .sr{margin-top:3mm;font-size:8pt;opacity:.55;letter-spacing:.5pt}
  /* ---- الأشكال ---- */
  .cert.land{--tz:38pt;--nz:28pt;--bz:15.5pt;--fz:12.5pt;--sw:48mm;--fm:9mm}
  .cert.land .main{top:18mm;bottom:18mm;right:22mm;left:22mm}.cert.land.hp .main{left:var(--ml,150mm);right:12mm}.cert.land.hp[data-side="right"] .main{left:12mm;right:var(--mr,150mm)}
  .cert.land .pic{left:12mm;top:12mm;bottom:12mm;width:128mm;height:auto;margin-top:0}.cert.land .pic.cut{top:12mm;bottom:12mm;margin-top:0}
  .cert.port{--tz:40pt;--nz:29pt;--bz:16.5pt;--fz:13pt;--sw:50mm;--fm:10mm}
  .cert.port .main{top:20mm;bottom:20mm;left:22mm;right:22mm}.cert.port.hp .main{top:var(--mt,154mm)}.cert.port.hp[data-side="bottom"] .main{top:20mm;bottom:var(--mb,154mm)}
  .cert.port .pic{top:18mm;left:18mm;right:18mm;height:108mm}.cert.port .pic.cut{top:14mm;left:34mm;right:34mm;height:118mm}
  .cert.sq{--tz:28pt;--nz:20pt;--bz:11.5pt;--fz:10pt;--sw:32mm;--fm:6mm}
  .cert.sq .main{top:18mm;bottom:18mm;right:20mm;left:20mm}.cert.sq.hp .main{left:var(--ml,109mm);right:12mm}.cert.sq.hp[data-side="right"] .main{left:12mm;right:var(--mr,109mm)}
  .cert.sq .pic{left:12mm;top:12mm;bottom:12mm;width:87mm}.cert.sq .pic.cut{top:16mm;bottom:0}
  .cert.sq .n{padding:1.6mm 8mm}.cert.sq .lg{height:11mm}.cert.sq .t::after{width:30mm}
  .cert.circle{--tz:24pt;--nz:17pt;--bz:10pt;--fz:9pt;--sw:28mm;--fm:5mm;background:#fff}
  .cert.circle .main{top:17mm;bottom:27mm;left:40mm;right:40mm}.cert.circle .pic.circle{width:46mm;height:46mm;margin-bottom:2.5mm}
  .cert.circle .n{padding:1.4mm 7mm}.cert.circle .lg{height:10mm}.cert.circle .t::after{width:26mm;margin-top:1.5mm}.cert.circle .k{margin-top:1.5mm}.cert.circle .n{margin:1.5mm 0 2mm}.cert.circle .b{line-height:1.7}.cert.circle .sr{display:none}
  .cert.circle .bg,.cert.circle .deco{inset:2mm;border-radius:50%;overflow:hidden}
  .cert.circle .bg::before,.cert.circle .bg::after,.cert.circle .deco::before,.cert.circle .deco::after{border-radius:50%}
  /* ---- التصميمات ---- */
  .cert.vivid{--ink:#e8eeff;--title:#fff;--accent:#5ee0ff;--soft:#b9c8f5;--plate:#fff;--plateInk:#12214f}
  .cert.vivid .bg{background:radial-gradient(circle at 12% 88%,rgba(94,224,255,.9),transparent 38%),radial-gradient(circle at 92% 8%,rgba(255,255,255,.35),transparent 30%),linear-gradient(135deg,#8b5cf6,#4f8cff 55%,#3fd8e6)}
  .cert.vivid .deco::before{inset:11mm;border-radius:7mm;background:linear-gradient(160deg,#16296b,#0d1a4a);box-shadow:0 3mm 10mm rgba(7,15,50,.45)}
  .cert.vivid .deco::after{inset:15mm;border-radius:5mm;border:.3mm solid rgba(94,224,255,.55)}
  .cert.vivid.circle .deco::before{inset:6mm;border-radius:50%}.cert.vivid.circle .deco::after{inset:10mm;border-radius:50%}
  .cert.vivid .t{--tf:'Cairo',sans-serif;font-weight:900}.cert.vivid .t::after{background:linear-gradient(90deg,transparent,#ffd166,transparent)}
  .cert.vivid .pic.frame{border-color:#fff}
  .cert.pharaoh{--ink:#f6edda;--title:#f1ca69;--accent:#d5a83b;--soft:#d2bd8a;--plate:#f6edda;--plateInk:#201605;--tf:'Aref Ruqaa','Reem Kufi',serif}
  .cert.pharaoh .bg{background:radial-gradient(ellipse at 50% 44%,rgba(94,65,19,.32),transparent 48%),radial-gradient(ellipse at 50% 0,#30220d 0,#17130d 47%,#090a0c 100%)}
  .cert.pharaoh .bg::before{inset:7mm;border:1mm solid var(--accent);box-shadow:inset 0 0 0 1.2mm #11100d,inset 0 0 0 1.6mm rgba(213,168,59,.72),0 0 18mm rgba(213,168,59,.12)}
  .cert.pharaoh .bg::after{inset:11mm;border:.35mm solid rgba(231,194,101,.62);background:linear-gradient(90deg,rgba(213,168,59,.08),transparent 12%,transparent 88%,rgba(213,168,59,.08))}
  .cert.pharaoh .deco::before,.cert.pharaoh .deco::after{left:13mm;right:13mm;height:6mm;border-block:.35mm solid var(--accent);background:repeating-linear-gradient(135deg,transparent 0 2.2mm,rgba(213,168,59,.72) 2.2mm 2.8mm,transparent 2.8mm 5.2mm),linear-gradient(90deg,transparent,rgba(213,168,59,.16),transparent);opacity:.9}
  .cert.pharaoh .deco::before{top:12mm}.cert.pharaoh .deco::after{bottom:12mm;transform:scaleY(-1)}
  .cert.pharaoh.circle .deco{display:none}
  .cert.pharaoh .t{background:linear-gradient(180deg,#fff4c9,#f0c65a 48%,#aa7418);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:calc(var(--tz) + 4pt);font-weight:700;text-shadow:0 1mm 3mm rgba(0,0,0,.35)}
  .cert.pharaoh .t::after{height:1mm;background:linear-gradient(90deg,transparent,var(--accent),#fff0bc,var(--accent),transparent)}
  .cert.pharaoh .n{background:linear-gradient(135deg,#fff7df,#e7d2a0);border:.45mm solid var(--accent);box-shadow:0 1mm 4mm rgba(0,0,0,.48),inset 0 0 0 .7mm rgba(255,255,255,.6)}
  .cert.pharaoh .pic.frame{border:1.4mm solid var(--accent);border-radius:1.5mm;box-shadow:0 0 0 1.1mm #100e09,0 0 0 1.8mm rgba(213,168,59,.78),0 3mm 9mm rgba(0,0,0,.7)}
  .cert.pharaoh .sg{border-color:var(--accent)}
  .cert.pharaoh .lg{filter:drop-shadow(0 1mm 2mm rgba(0,0,0,.65))}
  .cert.classic{--ink:#3a2a08;--title:#9a6a0a;--accent:#c98412;--soft:#7a6330;--plate:#fff3d2;--plateInk:#3a2a08;--pr:3mm;--pb:.35mm solid #c98412}
  .cert.classic .bg{background:#fffaf0}.cert.classic .bg::before{inset:8mm;border:3px double #c98412}.cert.classic .bg::after{inset:12.5mm;border:1px solid #e3b866}
  .cert.classic .n{box-shadow:none}
  .cert.navy{--ink:#e8edf8;--title:#f5b942;--accent:#f5b942;--soft:#aab8d8;--plate:#fff;--plateInk:#0f1c3a}
  .cert.navy .bg{background:radial-gradient(circle at 100% 0,rgba(245,185,66,.28),transparent 45%),radial-gradient(circle at 0 100%,rgba(245,185,66,.18),transparent 40%),#0f1c3a}
  .cert.navy .bg::before{inset:8mm;border:.5mm solid rgba(245,185,66,.75)}.cert.navy .bg::after{inset:11.5mm;border:.25mm solid rgba(245,185,66,.4)}
  .cert.minimal{--ink:#1b2440;--title:#0f1c3a;--accent:#f5b942;--soft:#667;--plate:#eef1f8;--plateInk:#0f1c3a;--pr:3mm}
  .cert.minimal .bg{background:#fff}.cert.minimal .bg::before{inset-block:0;right:0;width:13mm;background:#0f1c3a}.cert.minimal .bg::after{inset-block:0;right:13mm;width:2.6mm;background:#f5b942}
  .cert.minimal .n{box-shadow:none}.cert.minimal .pic.frame{border-color:#0f1c3a}
  .cert.minimal.circle .bg::before{inset:7mm;width:auto;background:none;border:3.5mm solid #0f1c3a;right:auto}.cert.minimal.circle .bg::after{display:none}
  .cert.kids{--ink:#243b6b;--title:#e84393;--accent:#ff9f43;--soft:#5b6f9e;--plate:#fff;--plateInk:#2f66dc;--pb:.6mm dashed #2f66dc;--tf:'Cairo',sans-serif}
  .cert.kids .bg{background:radial-gradient(circle at 8% 12%,#ffd9a0 0 6mm,transparent 6.3mm),radial-gradient(circle at 93% 85%,#ffc0dc 0 8mm,transparent 8.3mm),radial-gradient(circle at 90% 10%,#bfe3ff 0 5mm,transparent 5.3mm),#fff8e1}
  .cert.kids .bg::before{inset:7mm;border:4.5mm dotted #ff9f43;border-radius:14mm}.cert.circle.kids .bg::before{border-radius:50%}
  .cert.kids .t{font-weight:900}.cert.kids .pic.frame{border-radius:8mm}
  `;
  const FONT_IMPORT = `@import url('${FONTS}');`;

  const one = (c, s, i, prev) => {
    const m = FT.db.meta, [, , w, h] = shp(c.shape), tpl = TEMPLATES.find(x => x.id === +c.tpl), fontFamily = (FONTS_UI.find(x => x[0] === c.font) || FONTS_UI[0])[2];
    const bodySize = Math.max(12, Math.min(22, +c.bodySize || 16)), bodyAlign = ["center", "right", "justify"].includes(c.bodyAlign) ? c.bodyAlign : "center";
    const body = FT.msgTpl(c.body, { name: s.name, teacher: m.teacher || "المدرس", subject: m.subject || "المادة", group: s.group || "—", school: m.school || "", date: D.fmt(c.date), avg: s.avg == null ? "—" : s.avg + "%", att: s.att == null ? "—" : s.att + "%" });
    const src = m.photo || "";
    const photoStyle = !src ? "off" : (c.pmode || "frame");
    let mode = photoStyle;
    if (mode !== "off" && c.shape === "circle") mode = "circle";
    let pst = "", vars = "";
    if (mode !== "off" && mode !== "circle") {
      const bx = { land: [128, 186, 12, 10], sq: [87, 186, 12, 10], port: [174, 126, 18, 10] }[c.shape];
      if (c.shape === "port") { const ps = tpl && tpl.side === "right" ? "bottom" : "top"; pst = `${ps}:${bx[2]}mm;${ps === "top" ? "bottom" : "top"}:auto;left:50%;right:auto;margin-left:${-bx[0] / 2}mm;width:${bx[0]}mm;height:${bx[1]}mm`; vars = ps === "top" ? `--mt:${bx[2] + bx[1] + bx[3]}mm;` : `--mb:${bx[2] + bx[1] + bx[3]}mm;`; }
      else { const ps = tpl ? tpl.side : "left"; pst = `${ps}:${bx[2]}mm;${ps === "left" ? "right" : "left"}:auto;top:50%;bottom:auto;margin-top:${-bx[1] / 2}mm;width:${bx[0]}mm;height:${bx[1]}mm`; vars = ps === "left" ? `--ml:${bx[2] + bx[0] + bx[3]}mm;` : `--mr:${bx[2] + bx[0] + bx[3]}mm;`; }
    }
    const photoShape = tpl ? tpl.photoShape : "arch";
    const pic = mode === "off" ? "" : `<div class="pic ${mode === "fit" ? "frame fit" : mode} photo-${photoShape}" style="${pst}"><img src="${src}" alt=""></div>`;
    const inline = mode === "circle" ? pic : "", side = mode === "circle" ? "" : pic;
    const hp = mode !== "off" && mode !== "circle" ? " hp" : "";
    const len = (s.name || "").length, ns = len > 30 ? .66 : len > 24 ? .78 : len > 18 ? .9 : 1;
    const sg2 = c.signer2 ? `<div class="sg">${E(c.signer2)}<small>${E(c.role2 || "")}</small></div>` : `<div class="sp"></div>`;
    const tplClass = tpl ? ` gallery tpl-${tpl.id}` : "", photoSide = tpl ? (c.shape === "port" ? (tpl.side === "right" ? "bottom" : "top") : tpl.side) : (c.shape === "port" ? "top" : "left"), tplAttrs = tpl ? ` data-side="${photoSide}" data-photo="${tpl.photoShape}"` : "", pal = tpl ? tpl.palette : null;
    const palVars = pal ? `--tpl-paper:${pal.paper};--tpl-deep:${pal.deep};--tpl-accent:${E(c.accent || pal.accent)};--tpl-ink:${pal.ink};--tpl-soft:${pal.soft};` : "";
    const art = tpl ? `<div class="tpl-illustration" data-side="${photoSide}" data-position="${tpl.artpos}">${iconSvg(tpl.art,pal.accent)}</div>` : "";
    return `<div class="cert${tplClass} ${c.shape}${hp}"${tplAttrs} style="width:${w}mm;height:${h}mm;${vars}--py:${+c.py || 18}%;--accent:${E(c.accent || (pal && pal.accent) || "#d5a83b")};--tf:${fontFamily};--bsize:${bodySize}pt;--balign:${bodyAlign};${palVars}--ns:${ns}"><div class="bg"></div><div class="deco"></div>${art}${side}<div class="main">${inline}${m.logo ? `<img class="lg" src="${m.logo}" alt="">` : ""}<div class="t">${E(c.title)}</div><div class="k">تُمنح إلى</div><div class="n">${E(s.name)}</div><div class="b">${E(body)}</div>
      <div class="ft"><div class="sg">${E(c.signer || m.teacher || "")}<small>${E(c.role || "المدرس")}</small></div><div class="dt">${D.fmt(c.date)}</div>${sg2}</div>${c.serial ? `<div class="sr">No. ${E(c.serialPre || "C")}-${String((i || 0) + 1).padStart(3, "0")}</div>` : ""}</div></div>`;
  };

  FT.register({
    id: "certs", title: "الشهادات", icon: "award", order: 47,
    render(root) {
      const st = FT.certState = FT.certState || { preset: "appreciation", style: "vivid", shape: "land", pmode: "fit", accent: "#d5a83b", font: "reem", bodySize: 16, bodyAlign: "center", tpl: 1, serial: true, serialPre: "C", title: PRESETS.appreciation[0], body: PRESETS.appreciation[1], date: D.today(), signer: "", role: "المدرس", signer2: "", role2: "", names: "", gid: "", sel: new Set() };
      st.bodySize = +st.bodySize || 16; st.bodyAlign = ["center", "right", "justify"].includes(st.bodyAlign) ? st.bodyAlign : "center";
      const info = s => ({ name: s.name, group: (FT.group(s.groupId) || {}).name, avg: FT.stats.avgGrade(s.id), att: FT.stats.att(s.id).rate });
      const list = () => { const l = st.names.split("\n").map(x => x.trim()).filter(Boolean).map(name => ({ name })); FT.db.students.filter(s => st.sel.has(s.id)).forEach(s => l.push(info(s))); return l; };
      const syncBodyCount = () => { const el = FT.$("#cBC", root); if (!el) return; const text = String(st.body || "").trim(), words = text ? text.split(/\s+/).length : 0; el.textContent = `${words} كلمة · ${String(st.body || "").length} حرف`; };
      const css = () => { const [, , w, h] = shp(st.shape); return FONT_IMPORT + `@page{size:${w}mm ${h}mm;margin:0}*{box-sizing:border-box;margin:0;padding:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}` + ccss + tplCss; };
      const draw = () => {
        const oldGrid = FT.$(".tpl-grid", root), oldSearch = FT.$("#tplSearch", root), oldGallery = FT.$(".tpl-gallery", root);
        const galleryState = oldGrid ? { scrollTop: oldGrid.scrollTop, query: oldSearch ? oldSearch.value : "", open: oldGallery ? oldGallery.open : true } : null;
        const m = FT.db.meta;
        root.innerHTML = FT.pageHead("مصمم الشهادات", "100 تصميم برسوم وتكوينات مختلفة؛ اختر قالبًا، وستتكيّف مساحة الصورة مع صورة المدرّس.", `<button class="btn gold" id="cPr">${I("print")} طباعة الشهادات</button>`) + `<div class="grid" style="grid-template-columns:380px minmax(0,1fr);align-items:start" id="cL"><div class="card"><style>${tplCss}</style><details class="tpl-gallery" open><summary>معرض 100 تصميم مستقل <span>بإطارات ورسوم ومساحات صور مختلفة</span></summary><div class="tpl-tools"><input id="tplSearch" type="search" placeholder="ابحث باسم القالب..."></div><div class="tpl-grid" data-has-photo="${m.photo ? "yes" : "no"}" style="${m.photo ? `--teacher-photo:url(&quot;${E(m.photo)}&quot;)` : ""}">${TEMPLATES.map(t => `<button type="button" class="tpl-card ${+st.tpl === t.id ? "selected" : ""}" data-tpl="${t.id}" data-tpl-card="" aria-label="القالب ${t.id}: ${E(t.name)}"><div class="tpl-mini" data-template="${t.id}" data-side="${t.side}" style="--tpl-paper:${t.palette.paper};--tpl-deep:${t.palette.deep};--tpl-accent:${t.palette.accent};--tpl-ink:${t.palette.ink}"><span class="tpl-number">${String(t.id).padStart(2,"0")}</span><div class="tpl-mini-photo" data-photo="${t.photoShape}"></div><div class="tpl-mini-copy"><span class="tpl-mini-art">${iconSvg(t.art,t.palette.accent)}</span><b>شهادة تقدير</b><i></i><i></i></div></div><span class="tpl-label">${String(t.id).padStart(2,"0")} · ${E(t.name)}</span></button>`).join("")}</div></details><div class="fgrid">
          <div class="f"><span>نوع الشهادة</span><select id="cP">${Object.entries(PRESETS).map(([k, v]) => `<option value="${k}" ${k === st.preset ? "selected" : ""}>${v[0]}</option>`).join("")}</select></div>
          <div class="f"><span>الشكل</span><div class="seg">${SHAPES.map(([k, l]) => `<button data-sh="${k}" class="${st.shape === k ? "on" : ""}">${l}</button>`).join("")}</div></div>
          <div class="f cert-copybox"><div class="cert-copyhead"><b>صياغة الشهادة</b><span class="cert-copycount" id="cBC"></span></div>
            <div class="f"><span>عنوان الشهادة</span><input data-k="title" value="${E(st.title)}" placeholder="مثلًا: شهادة تقدير"></div>
            <div class="f mt"><span>نص الشهادة</span><textarea id="cB" data-k="body" rows="5" placeholder="اكتب صياغة موجزة وواضحة...">${E(st.body)}</textarea></div>
            <div class="cert-copytoolbar"><label><span>محاذاة النص</span><select data-k="bodyAlign"><option value="center" ${st.bodyAlign === "center" ? "selected" : ""}>توسيط أنيق</option><option value="right" ${st.bodyAlign === "right" ? "selected" : ""}>يمين</option><option value="justify" ${st.bodyAlign === "justify" ? "selected" : ""}>ضبط الفقرات</option></select></label>
            <label><span>حجم نص المتن</span><select data-k="bodySize">${[14,16,18,20].map(z => `<option value="${z}" ${+st.bodySize === z ? "selected" : ""}>${z} نقطة</option>`).join("")}</select></label></div>
            <div class="cert-copyhint">تظهر الأسطر والفقرات كما كتبتها في المعاينة والطباعة. ويمكنك استخدام: {name} اسم الطالب، {teacher} المدرس، {subject} المادة، {group} المجموعة، {date} التاريخ، {avg} المتوسط، {att} الحضور.</div>
          </div>
          <div class="f half"><span>لون الزخارف (حسب ذوقك)</span><div class="row" style="gap:8px;align-items:center"><input type="color" data-k="accent" value="${E(st.accent || "#d5a83b")}" aria-label="لون الزخارف" style="width:48px;height:38px;padding:3px"><span class="muted sm">لون الإطار والتفاصيل الزخرفية</span></div></div>
          <div class="f half"><span>خط عنوان الشهادة</span><select data-k="font">${FONTS_UI.map(([k, label]) => `<option value="${k}" ${k === (st.font || "reem") ? "selected" : ""}>${label}</option>`).join("")}</select></div>
          <div class="f half"><span>التاريخ</span><input type="date" data-k="date" value="${st.date}"></div><div class="f half"><span>التوقيع</span><input data-k="signer" value="${E(st.signer)}" placeholder="${E(m.teacher || "")}"></div>
          <div class="f half"><span>الصفة</span><input data-k="role" value="${E(st.role)}"></div><div class="f half"><span>توقيع ثاني (اختياري)</span><input data-k="signer2" value="${E(st.signer2)}"></div>
          <div class="f"><span>صورة المدرس</span><div class="row" style="gap:10px">${m.photo ? `<img src="${m.photo}" style="width:46px;height:46px;border-radius:50%;object-fit:cover">` : ""}<input type="file" id="cPh" accept="image/*" style="max-width:230px">${m.photo ? `<button class="btn ghost sm" id="cPhDel">حذف</button>` : ""}</div><div class="muted sm mt">ارفع صورة المدرس؛ من غير صورة النص يستخدم المساحة كاملة، ومع وجودها ينقسم التصميم تلقائيًا نصفًا للصورة ونصفًا لنص الشهادة.</div></div>
          <div class="f"><span>وضع الصورة على الشهادة</span><div class="seg">${PMODES.map(([k, l]) => `<button data-pm="${k}" class="${st.pmode === k ? "on" : ""}">${l}</button>`).join("")}</div><div class="muted sm mt">«مقصوصة» تناسب الصور ذات الخلفية الشفافة؛ وباقي الأوضاع تلائم الصور العادية.</div><label class="chk mt"><input type="checkbox" id="cSr" ${st.serial ? "checked" : ""}>رقم تسلسلي أسفل كل شهادة</label></div>
          <div class="f"><span>الطلاب</span><select id="cG"><option value="">اختار مجموعة</option>${FT.db.groups.map(g => `<option value="${g.id}" ${g.id === st.gid ? "selected" : ""}>${E(g.name)}</option>`).join("")}</select>${st.gid ? `<div class="row mt"><button class="btn ghost sm" id="cAll">الكل</button><button class="btn ghost sm" id="cNone">مسح</button></div><div class="checks mt">${FT.groupStudents(st.gid).map(s => `<label><input type="checkbox" data-s="${s.id}" ${st.sel.has(s.id) ? "checked" : ""}>${E(s.name)}</label>`).join("")}</div>` : ""}</div>
          <div class="f"><span>أو اكتب أسماء (اسم في كل سطر)</span><textarea data-k="names" rows="3">${E(st.names)}</textarea></div></div></div>
        <div class="card" style="background:#e9edf6;padding:14px;overflow:hidden"><div id="cPv" style="width:100%"></div><div class="muted sm center mt" id="cN"></div></div></div>`;
        if (galleryState) {
          const grid = FT.$(".tpl-grid", root), search = FT.$("#tplSearch", root), gallery = FT.$(".tpl-gallery", root);
          if (search) search.value = galleryState.query;
          if (gallery) gallery.open = galleryState.open;
          if (grid) { grid.scrollTop = galleryState.scrollTop; const q = galleryState.query.trim().toLowerCase(); FT.$$ ("[data-tpl-card]", root).forEach(card => { card.hidden = q && !card.textContent.toLowerCase().includes(q); }); }
        }
        if (innerWidth < 1050) FT.$("#cL", root).style.gridTemplateColumns = "1fr";
        if (m.photo && !m.photoR) { const im = new Image(); im.onload = () => { m.photoR = im.width / im.height; FT.save(); pv(); }; im.src = m.photo; }
        syncBodyCount();
        pv();
        FT.$("#cP", root).onchange = e => { st.preset = e.target.value; [st.title, st.body] = PRESETS[st.preset]; draw(); };
        FT.$$ ("[data-tpl]", root).forEach(b => b.onclick = () => { const t = TEMPLATES.find(x => x.id === +b.dataset.tpl); if (!t) return; st.tpl = t.id; st.accent = t.palette.accent; st.font = t.font; draw(); });
        FT.on(root, "input", "#tplSearch", (e, el) => { const q = el.value.trim().toLowerCase(); FT.$$ ("[data-tpl-card]", root).forEach(card => { card.hidden = !card.textContent.toLowerCase().includes(q); }); });
        FT.$$("[data-sh]", root).forEach(b => b.onclick = () => { st.shape = b.dataset.sh; draw(); });
        FT.on(root, "input", "[data-k]", (e, el) => { st[el.dataset.k] = el.value; if (el.dataset.k === "body") syncBodyCount(); pv(); });
        FT.on(root, "change", "[data-k]", (e, el) => { st[el.dataset.k] = el.value; pv(); });
        FT.$$("[data-pm]", root).forEach(b => b.onclick = () => { st.pmode = b.dataset.pm; draw(); });
        const pd = FT.$("#cPhDel", root); if (pd) pd.onclick = () => { delete FT.db.meta.photo; FT.save(true); draw(); };
        FT.$("#cSr", root).onchange = e => { st.serial = e.target.checked; pv(); };
        FT.$("#cPh", root).onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { const img = new Image(); img.onload = () => { const png = /png|webp|gif/.test(f.type); let mx = 900, out; do { const k = Math.min(1, mx / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); out = c.toDataURL(png ? "image/png" : "image/jpeg", .9); mx -= 150; } while (png && out.length > 1.4e6 && mx > 450); FT.db.meta.photo = out; FT.db.meta.photoR = img.width / img.height; FT.save(true); st.pmode = st.pmode === "off" ? "frame" : st.pmode; draw(); FT.toast("تم حفظ الصورة", "ok"); }; img.src = rd.result; }; rd.readAsDataURL(f); };
        FT.$("#cG", root).onchange = e => { st.gid = e.target.value; st.sel = new Set(); draw(); };
        FT.on(root, "change", "[data-s]", (e, el) => { el.checked ? st.sel.add(el.dataset.s) : st.sel.delete(el.dataset.s); pv(); });
        const a = FT.$("#cAll", root); if (a) { a.onclick = () => { FT.groupStudents(st.gid).forEach(s => st.sel.add(s.id)); draw(); }; FT.$("#cNone", root).onclick = () => { st.sel = new Set(); draw(); }; }
        FT.$("#cPr", root).onclick = () => { const l = list(); if (!l.length) return FT.toast("اختار طالب أو اكتب اسم", "bad"); FT.printHTML(l.map((s, i) => one(st, s, i)).join(""), st.title, css()); };
      };
      function pv() { const l = list(), box = FT.$("#cPv", root), [, , w, h] = shp(st.shape), bw = box.clientWidth || 640, k = Math.min(1, bw / (w * 3.78)); box.style.height = (h * 3.78 * k) + "px"; box.style.position = "relative"; box.innerHTML = `<style>${ccss}${tplCss}</style><div style="transform:scale(${k});transform-origin:top right;width:${w}mm;position:absolute;right:0;top:0">${one(st, l[0] || { name: "اسم الطالب", group: "اسم المجموعة", avg: 92, att: 96 }, 0, true)}</div>`; FT.$("#cN", root).textContent = (l.length ? `${l.length} شهادة جاهزة للطباعة` : "اختار طلاب علشان تتطبع شهادة لكل واحد") + `${st.tpl ? ` · القالب ${st.tpl} من 100` : " · 100 قالب مستقل"} · تصميمات قابلة للتخصيص`; }
      draw();
    }
  });
})();
