(function () {
  const FT = window.FT, E = FT.esc, I = FT.icon, root = document.getElementById("rn");
  const head = sub => `<div class="rn-top"><div class="logo">${FT.logoSvg}</div><div><b>FASL TECH</b><small>${E(sub || "مذاكرة")}</small></div></div>`;
  document.addEventListener("DOMContentLoaded", async () => {
    let X; try { X = await FT.codec.unpack(location.hash.slice(1)); } catch (e) { root.innerHTML = head() + `<div class="card center">${FT.empty("alert", "الرابط تالف", "اطلب من مدرسك يبعت الرابط تاني.")}</div>`; return; }
    document.title = X.t + " | FASL TECH";
    const key = "fts:" + X.id; let saved = {}; try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { }
    const cards = X.c.map((c, i) => Object.assign({ id: "c" + i, f: c[0], b: c[1], box: 1, due: "" }, saved["c" + i] || {}));
    root.innerHTML = head(X.tn ? "مع " + X.tn : "") + `<div class="rn-hero"><h1>${E(X.t)}</h1><p>${X.c.length} بطاقة</p></div><div id="stBox"></div>`;
    FT.study.mount(FT.$("#stBox", root), { title: X.t, cards, onUpdate: c => { saved[c.id] = { box: c.box, due: c.due }; try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) { } } });
  });
})();
