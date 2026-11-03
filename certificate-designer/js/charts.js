/* ===================== رسوم SVG بدون مكتبات ===================== */
(function () {
  const FT = window.FT, E = FT.esc;
  const PAL = ["#2f66dc", "#14966a", "#d98b0b", "#c2410c", "#7c3aed", "#0e8aa6", "#b4237a", "#5a6b2d"];
  const niceMax = v => { if (v <= 0) return 10; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; };
  const C = FT.charts = {};

  /* أعمدة: data=[{l,v,c?}] أو series */
  C.bar = (data, o = {}) => {
    const W = o.w || 560, H = o.h || 240, m = { t: 14, r: 10, b: 34, l: 40 };
    const max = o.max || niceMax(Math.max(...data.map(d => d.v), 1));
    const iw = W - m.l - m.r, ih = H - m.t - m.b, bw = Math.min(46, iw / data.length * .62), step = iw / data.length;
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${E(o.label || "رسم بياني")}">`;
    for (let i = 0; i <= 4; i++) { const y = m.t + ih - ih * i / 4; s += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}"/><text x="${m.l - 6}" y="${y + 4}" text-anchor="end">${FT.fmt(max * i / 4)}${o.unit || ""}</text>`; }
    data.forEach((d, i) => {
      const h = Math.max(d.v > 0 ? 2 : 0, ih * d.v / max), x = m.l + step * i + (step - bw) / 2, y = m.t + ih - h;
      s += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="5" fill="${d.c || o.color || PAL[0]}"><title>${E(d.l)}: ${FT.fmt(d.v, 1)}${o.unit || ""}</title></rect>`;
      if (data.length <= 14) s += `<text x="${x + bw / 2}" y="${y - 5}" text-anchor="middle" style="font-weight:700;fill:var(--text)">${FT.fmt(d.v, 1)}</text>`;
      s += `<text x="${x + bw / 2}" y="${H - 12}" text-anchor="middle">${E(String(d.l).length > 9 ? String(d.l).slice(0, 8) + "…" : d.l)}</text>`;
    });
    return s + "</svg>";
  };
  /* خط: data=[{l,v}] */
  C.line = (data, o = {}) => {
    const W = o.w || 560, H = o.h || 220, m = { t: 14, r: 28, b: 30, l: 44 };
    if (!data.length) return "";
    const max = o.max || niceMax(Math.max(...data.map(d => d.v), 1)), min = o.min || 0;
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const X = i => m.l + (data.length === 1 ? iw / 2 : iw * i / (data.length - 1)), Y = v => m.t + ih - ih * (v - min) / (max - min || 1);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${E(o.label || "رسم بياني")}">`;
    for (let i = 0; i <= 4; i++) { const y = m.t + ih - ih * i / 4; s += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}"/><text x="${m.l - 6}" y="${y + 4}" text-anchor="end">${FT.fmt(min + (max - min) * i / 4)}${o.unit || ""}</text>`; }
    const pts = data.map((d, i) => X(i) + "," + Y(d.v)).join(" ");
    const col = o.color || PAL[0];
    s += `<polygon points="${X(0)},${m.t + ih} ${pts} ${X(data.length - 1)},${m.t + ih}" fill="${col}" opacity=".12"/><polyline points="${pts}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
    data.forEach((d, i) => { s += `<circle cx="${X(i)}" cy="${Y(d.v)}" r="4" fill="var(--card)" stroke="${col}" stroke-width="2.5"><title>${E(d.l)}: ${FT.fmt(d.v, 1)}${o.unit || ""}</title></circle>`; if (data.length <= 12 || i % Math.ceil(data.length / 10) === 0) s += `<text x="${X(i)}" y="${H - 8}" text-anchor="middle">${E(d.l)}</text>`; });
    return s + "</svg>";
  };
  /* دونات: data=[{l,v,c}] */
  C.donut = (data, o = {}) => {
    const tot = FT.sum(data.map(d => d.v)), R = 70, r = 46, S = 180;
    if (!tot) return `<div class="muted center sm" style="padding:30px">مفيش بيانات لسه</div>`;
    let a0 = -Math.PI / 2, paths = "";
    data.forEach((d, i) => {
      if (!d.v) return;
      const a = d.v / tot * Math.PI * 2, a1 = a0 + a, big = a > Math.PI ? 1 : 0, c = d.c || PAL[i % PAL.length];
      const P = (rad, ang) => [90 + rad * Math.cos(ang), 90 + rad * Math.sin(ang)];
      if (d.v === tot) paths += `<circle cx="90" cy="90" r="${(R + r) / 2}" fill="none" stroke="${c}" stroke-width="${R - r}"/>`;
      else { const [x1, y1] = P(R, a0), [x2, y2] = P(R, a1), [x3, y3] = P(r, a1), [x4, y4] = P(r, a0); paths += `<path d="M${x1} ${y1}A${R} ${R} 0 ${big} 1 ${x2} ${y2}L${x3} ${y3}A${r} ${r} 0 ${big} 0 ${x4} ${y4}Z" fill="${c}"><title>${E(d.l)}: ${FT.fmt(d.v, 1)}</title></path>`; }
      a0 = a1;
    });
    const leg = data.map((d, i) => `<span><i style="background:${d.c || PAL[i % PAL.length]}"></i>${E(d.l)} <b>${FT.fmt(d.v, 1)}</b></span>`).join("");
    return `<div class="row" style="gap:18px;justify-content:center"><svg viewBox="0 0 ${S} ${S}" style="width:${o.size || 170}px;flex:none" role="img" aria-label="${E(o.label || "رسم دائري")}">${paths}<text x="90" y="88" text-anchor="middle" style="font-size:22px;font-weight:800;fill:var(--text)">${E(o.center != null ? o.center : FT.fmt(tot, 0))}</text><text x="90" y="106" text-anchor="middle" style="font-size:10px">${E(o.centerLabel || "الإجمالي")}</text></svg><div class="legend" style="flex-direction:column;gap:6px">${leg}</div></div>`;
  };
  /* حلقة نسبة */
  C.ring = (pct, o = {}) => {
    const s = o.size || 96, r = s / 2 - 9, c = 2 * Math.PI * r, col = o.color || (pct >= 85 ? "var(--ok)" : pct >= 60 ? "var(--warn)" : "var(--bad)");
    return `<svg viewBox="0 0 ${s} ${s}" style="width:${s}px;height:${s}px" role="img" aria-label="${pct}%"><circle cx="${s / 2}" cy="${s / 2}" r="${r}" fill="none" stroke="var(--line)" stroke-width="9"/><circle cx="${s / 2}" cy="${s / 2}" r="${r}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c * Math.min(pct, 100) / 100} ${c}" transform="rotate(-90 ${s / 2} ${s / 2})"/><text x="${s / 2}" y="${s / 2 + 6}" text-anchor="middle" style="font-size:${s / 4.2}px;font-weight:800;fill:var(--text)">${pct}%</text></svg>`;
  };
  /* أشرطة أفقية: data=[{l,v,max?,c?}] */
  C.hbars = (data, o = {}) => {
    const max = o.max || Math.max(...data.map(d => d.v), 1);
    return data.map(d => `<div class="hbar"><span class="t" title="${E(d.l)}">${E(d.l)}</span><div class="prog ${d.cls || ""}" style="height:10px"><i style="width:${Math.min(100, d.v / (d.max || max) * 100)}%;${d.c ? `background:${d.c}` : ""}"></i></div><span class="v">${FT.fmt(d.v, 1)}${o.unit || ""}</span></div>`).join("");
  };
  /* خريطة حرارية للحضور: rows=[{l, cells:[{t,s}]}] s=p/a/l/e/'' */
  C.heat = (cells, o = {}) => `<div class="row" style="gap:4px">${cells.map(c => `<span class="mk sq ${c.s || ""}" title="${E(c.t)}"></span>`).join("")}</div>`;
  /* مضاعف: أعمدة مجمّعة سلسلتين: data=[{l,a,b}] */
  C.bar2 = (data, o = {}) => {
    const W = o.w || 560, H = o.h || 240, m = { t: 14, r: 10, b: 34, l: 44 };
    const max = o.max || niceMax(Math.max(...data.map(d => Math.max(d.a, d.b)), 1));
    const iw = W - m.l - m.r, ih = H - m.t - m.b, step = iw / data.length, bw = Math.min(26, step * .36);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${E(o.label || "رسم بياني")}">`;
    for (let i = 0; i <= 4; i++) { const y = m.t + ih - ih * i / 4; s += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}"/><text x="${m.l - 6}" y="${y + 4}" text-anchor="end">${FT.fmt(max * i / 4)}</text>`; }
    data.forEach((d, i) => {
      const cx = m.l + step * i + step / 2;
      [[d.a, o.ca || "#14966a", -bw - 1], [d.b, o.cb || "#d93f35", 1]].forEach(([v, c, dx]) => { const h = Math.max(v > 0 ? 2 : 0, ih * v / max); s += `<rect x="${cx + dx}" y="${m.t + ih - h}" width="${bw}" height="${h}" rx="4" fill="${c}"><title>${E(d.l)}: ${FT.fmt(v)}</title></rect>`; });
      s += `<text x="${cx}" y="${H - 12}" text-anchor="middle">${E(d.l)}</text>`;
    });
    return s + "</svg>";
  };
  C.spark = (vals, o = {}) => {
    if (vals.length < 2) return "";
    const W = 90, H = 26, max = Math.max(...vals), min = Math.min(...vals), p = vals.map((v, i) => `${i * W / (vals.length - 1)},${H - 3 - (H - 6) * (v - min) / ((max - min) || 1)}`).join(" ");
    return `<svg viewBox="0 0 ${W} ${H}" style="width:${W}px;height:${H}px;direction:ltr"><polyline points="${p}" fill="none" stroke="${o.color || "var(--info)"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  };
  /* نص SVG → PNG */
  C.toPNG = (svgEl, name) => new Promise(res => {
    const xml = new XMLSerializer().serializeToString(svgEl), img = new Image();
    img.onload = () => { const c = document.createElement("canvas"); c.width = img.width * 2; c.height = img.height * 2; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); c.toBlob(b => { FT.saveBlob(b, name); res(); }); };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  });
})();
