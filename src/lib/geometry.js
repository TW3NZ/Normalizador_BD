export const COL = { PK: '#d32f2f', FK: '#2e7d32', UK: '#1565c0' };
export const KT = ['', 'PK', 'FK', 'UK', 'PK/FK'];
export const kc = (k) => COL[(k || '').split('/')[0]] || '#1b2a41';
export const E = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const geo = (t) => ({
  w: Math.max(190, Math.ceil(24 + 7.6 * Math.max((t.n || '').length * 1.3, ...t.f.map((f) => (f.n || '').length + (f.k ? 6 : 0))))),
  h: 42 + Math.max(t.f.length, 1) * 22,
});

/** Punto de anclaje en el borde de la tabla `t` hacia la tabla `o`, con la normal del borde. */
export function anc(t, o) {
  const g = geo(t), h = geo(o);
  const cx = t.x + g.w / 2, cy = t.y + g.h / 2;
  const dx = o.x + h.w / 2 - cx, dy = o.y + h.h / 2 - cy;
  const V = (dx ? g.w / 2 / Math.abs(dx) : 1e9) < (dy ? g.h / 2 / Math.abs(dy) : 1e9);
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  let px, py, ex, ey;
  if (V) {
    ex = dx < 0 ? -1 : 1; ey = 0;
    px = ex > 0 ? t.x + g.w : t.x;
    py = cl(cy + (dx ? (dy * (g.w / 2)) / Math.abs(dx) : 0), t.y + 16, t.y + g.h - 16);
  } else {
    ex = 0; ey = dy < 0 ? -1 : 1;
    py = ey > 0 ? t.y + g.h : t.y;
    px = cl(cx + (dy ? (dx * (g.h / 2)) / Math.abs(dy) : 0), t.x + 16, t.x + g.w - 16);
  }
  return { px, py, ex, ey, x: px + ex * 20, y: py + ey * 20 };
}

/** Terminación de línea: 'one' = barra vertical, 'many' = pata de gallo de tres ramas. */
const mk = (p, m, c) => {
  const tx = Math.abs(p.ey), ty = Math.abs(p.ex);
  const L = (a, b, c2, d) =>
    `<line x1="${a}" y1="${b}" x2="${c2}" y2="${d}" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`;
  let s = L(p.px, p.py, p.x, p.y);
  if (m === 'one') {
    const bx = p.px + p.ex * 10, by = p.py + p.ey * 10;
    s += L(bx - tx * 9, by - ty * 9, bx + tx * 9, by + ty * 9);
  } else {
    s += L(p.x, p.y, p.px - tx * 10, p.py - ty * 10) + L(p.x, p.y, p.px + tx * 10, p.py + ty * 10);
  }
  return s;
};

/** Contenido SVG del diagrama (el mismo para la pantalla y para el PDF). */
export function dgContent(S, sel, first, I) {
  const ts = S.t.filter((t) => t.x != null);
  const T = (id) => ts.find((t) => t.id === id);
  let s = '';
  S.r.forEach((r) => {
    const a = T(r.a), b = T(r.b);
    if (!a || !b) return;
    const A1 = anc(a, b), B1 = anc(b, a);
    const c = r.c === 'M:M' ? '#e08a00' : '#1f3a68';
    const mx = (A1.x + B1.x) / 2, my = (A1.y + B1.y) / 2;
    const [la, lb] = r.c === '1:1' ? ['one', 'one'] : r.c === '1:M' ? ['one', 'many'] : ['many', 'many'];
    s += `<line x1="${A1.x}" y1="${A1.y}" x2="${B1.x}" y2="${B1.y}" stroke="${c}" stroke-width="1.8"/>${mk(A1, la, c)}${mk(B1, lb, c)}<rect x="${mx - 18}" y="${my - 10}" width="36" height="20" rx="4" fill="#fff" stroke="${c}"/><text x="${mx}" y="${my + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="${c}">${r.c}</text>`;
  });
  ts.forEach((t) => {
    const g = geo(t), h = I && (t.id === sel || t.id === first);
    s += `<g data-t="${t.id}" style="cursor:move"><rect x="${t.x}" y="${t.y}" width="${g.w}" height="${g.h}" rx="6" fill="#fff" stroke="${h ? '#e08a00' : '#1f3a68'}" stroke-width="${h ? 3 : 1.8}"/><rect x="${t.x}" y="${t.y}" width="${g.w}" height="30" rx="6" fill="#1f3a68"/><rect x="${t.x}" y="${t.y + 20}" width="${g.w}" height="10" fill="#1f3a68"/><text x="${t.x + g.w / 2}" y="${t.y + 20}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">${E(t.n) || 'Sin nombre'}</text>`;
    t.f.forEach((f, i) => {
      s += `<text x="${t.x + 10}" y="${t.y + 52 + i * 22}" font-size="13" ${f.k ? 'font-weight="700"' : ''} fill="${kc(f.k)}">${E(f.n) || '…'}${f.k ? ' (' + f.k.replace('/', ',') + ')' : ''}</text>`;
    });
    s += '</g>';
  });
  return s;
}

export function bbox(tables) {
  const ts = tables.filter((t) => t.x != null);
  if (!ts.length) return { x: 0, y: 0, w: 400, h: 300 };
  let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
  ts.forEach((t) => {
    const g = geo(t);
    a = Math.min(a, t.x); b = Math.min(b, t.y);
    c = Math.max(c, t.x + g.w); d = Math.max(d, t.y + g.h);
  });
  return { x: Math.round(a - 30), y: Math.round(b - 30), w: Math.round(c - a + 60), h: Math.round(d - b + 60) };
}

/** Distribuye en cuadrícula. Sin `force`, solo coloca las tablas que no tienen posición. */
export function lay(n, force) {
  n.t.forEach((t, i) => {
    if (force || t.x == null) {
      t.x = 40 + (i % 3) * 270;
      t.y = 40 + ((i / 3) | 0) * 300;
    }
  });
}
