import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useC } from '../context.js';
import { dgContent, bbox, lay } from '../lib/geometry.js';

/** Lienzo SVG interactivo: arrastre de tablas, pan, zoom, cuadrícula y viewport persistente. */
export default function Diagram({ edit = false, height = 520, extra = null }) {
  const { S, upd, ask, sel, setSel, conn, setConn, first, setFirst, cd, fitTick, bumpFit } = useC();
  const box = useRef(), svg = useRef(), drag = useRef(null), L = useRef({});
  const needFit = useRef(!S.v), lastTick = useRef(fitTick);
  const [size, setSize] = useState({ w: 800, h: height, m: false });
  const [vb, setVb] = useState(S.v || { x: -20, y: -20, w: 1000 });
  const hh = vb.w * size.h / size.w;

  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => {
      const r = box.current.getBoundingClientRect();
      if (r.width) setSize({ w: r.width, h: r.height, m: true });
    });
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  // Solo posiciona las tablas que aún no tienen coordenadas; nunca reorganiza las demás.
  useLayoutEffect(() => { if (S.t.some((t) => t.x == null)) upd((n) => lay(n)); }, [S.t]);

  const commit = (v) => { setVb(v); upd((n) => { n.v = v; }); };
  const fit = () => {
    if (!S.t.length) return;
    const b = bbox(S.t), a = size.h / size.w, w = Math.max(b.w, b.h / a);
    commit({ w, x: b.x - (w - b.w) / 2, y: b.y - (w * a - b.h) / 2 });
  };
  const zoom = (f) => commit({ w: vb.w * f, x: vb.x + vb.w / 2 - (vb.w * f) / 2, y: vb.y + hh / 2 - (hh * f) / 2 });
  const center = () => {
    if (!S.t.length) return;
    const b = bbox(S.t);
    commit({ ...vb, x: b.x + b.w / 2 - vb.w / 2, y: b.y + b.h / 2 - hh / 2 });
  };

  const ready = size.m && S.t.every((t) => t.x != null);
  useEffect(() => { if (ready && needFit.current) { needFit.current = false; fit(); } }, [ready, S.t]);
  useEffect(() => { if (ready && lastTick.current !== fitTick) { lastTick.current = fitTick; fit(); } }, [fitTick, S.t]);

  const pt = (ev) => {
    const r = svg.current.getBoundingClientRect(), s = L.current.vb.w / r.width;
    return { x: L.current.vb.x + (ev.clientX - r.left) * s, y: L.current.vb.y + (ev.clientY - r.top) * s };
  };
  L.current.vb = vb; L.current.commit = commit; L.current.pt = pt;
  L.current.move = (ev) => {
    const d = drag.current;
    if (!d) return;
    if (d.pan) {
      const s = vb.w / svg.current.getBoundingClientRect().width;
      setVb({ ...vb, x: d.vx - (ev.clientX - d.sx) * s, y: d.vy - (ev.clientY - d.sy) * s });
    } else {
      const p = pt(ev), q = (v) => (S.g ? Math.round(v / 20) * 20 : Math.round(v));
      upd((n) => { const t = n.t.find((t) => t.id === d.id); t.x = q(p.x - d.dx); t.y = q(p.y - d.dy); });
    }
  };
  L.current.up = () => { const d = drag.current; drag.current = null; if (d && d.pan) commit(vb); };

  useEffect(() => {
    const e = svg.current;
    const w = (ev) => {
      ev.preventDefault();
      const { vb: v, pt: p2, commit: c } = L.current, p = p2(ev);
      const w2 = Math.min(5000, Math.max(250, v.w * (ev.deltaY > 0 ? 1.12 : 0.89))), k = w2 / v.w;
      c({ w: w2, x: p.x - (p.x - v.x) * k, y: p.y - (p.y - v.y) * k });
    };
    e.addEventListener('wheel', w, { passive: false });
    return () => e.removeEventListener('wheel', w);
  }, []);

  const down = (ev) => {
    const g = ev.target.closest('[data-t]'), p = pt(ev);
    if (g) {
      const id = g.dataset.t;
      if (conn && edit) {
        if (!first) setFirst(id);
        else if (first !== id) {
          const a = first;
          upd((n) => { n.r.push({ id: 'r' + n.n++, a, b: id, c: cd }); });
          setFirst(null); setConn(false);
        }
        return;
      }
      const t = S.t.find((t) => t.id === id);
      setSel(id);
      drag.current = { id, dx: p.x - t.x, dy: p.y - t.y };
    } else {
      setSel(null);
      drag.current = { pan: 1, sx: ev.clientX, sy: ev.clientY, vx: vb.x, vy: vb.y };
    }
    const mv = (e) => L.current.move(e);
    const up = () => { window.removeEventListener('pointermove', mv); L.current.up(); };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up, { once: true });
  };

  const grid = S.g
    ? `<defs><pattern id="gr" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#dfe5ee" stroke-width="1"/></pattern></defs><rect x="${vb.x}" y="${vb.y}" width="${vb.w}" height="${hh}" fill="url(#gr)"/>`
    : '';
  const body = S.t.length ? dgContent(S, sel, first, true) : '<text x="20" y="40" font-size="16" fill="#667286">Aún no hay tablas en el modelo.</text>';

  return (
    <div>
      <div className="row" style={{ marginBottom: 10 }}>
        {extra}
        <button className="btn g" onClick={() => zoom(0.8)}>＋ Zoom</button>
        <button className="btn g" onClick={() => zoom(1.25)}>－ Zoom</button>
        <button className="btn g" onClick={center}>Centrar</button>
        <button className="btn g" onClick={fit}>Ajustar a pantalla</button>
        <button className={'btn ' + (S.g ? '' : 'g')} onClick={() => upd((n) => { n.g = !n.g; })}>
          Cuadrícula {S.g ? 'activada' : 'desactivada'}
        </button>
        <button className="btn d" onClick={() => ask('¿Restablecer la distribución? Las tablas volverán a una cuadrícula ordenada. No se borra ninguna tabla, campo ni relación.', () => { upd((n) => lay(n, true)); bumpFit(); })}>
          Restablecer distribución
        </button>
      </div>
      <div ref={box} className="dg" style={{ height }}>
        <svg ref={svg} width="100%" height="100%" viewBox={`${vb.x} ${vb.y} ${vb.w} ${hh}`}
          fontFamily="Arial, Helvetica, sans-serif"
          style={{ display: 'block', cursor: conn ? 'crosshair' : 'grab', touchAction: 'none' }}
          onPointerDown={down} dangerouslySetInnerHTML={{ __html: grid + body }} />
      </div>
    </div>
  );
}
