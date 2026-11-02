import { jsPDF } from 'jspdf';
import { dgContent, bbox } from './geometry.js';

const fl = (f) => f.n + (f.k ? ' (' + f.k.replace('/', ',') + ')' : '');

/** Genera y descarga el PDF. full=true incluye el proceso de normalización antes del diagrama. */
export async function exportPdf(S, full) {
  const T = (id) => S.t.find((t) => t.id === id) || {};
  const P = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  let y = 0;
  const head = (t) => {
    P.setFont('helvetica', 'bold'); P.setFontSize(18); P.setTextColor(31, 58, 104); P.text(S.p.name, 14, 16);
    P.setFont('helvetica', 'normal'); P.setFontSize(10); P.setTextColor(90);
    P.text('Diseñado por: ' + S.p.author + '   ·   Fecha de elaboración: ' + S.p.date, 14, 23);
    P.setFontSize(12); P.setTextColor(0); P.text(t, 14, 31);
  };
  const L = (s, b) => {
    P.setFont('helvetica', b ? 'bold' : 'normal'); P.setFontSize(10); P.setTextColor(0);
    P.splitTextToSize(s, 265).forEach((l) => {
      if (y > 196) { P.addPage(); y = 16; }
      P.text(l, 16, y); y += 5.2;
    });
  };

  if (full) {
    head('Proceso de normalización'); y = 40;
    L('1. Primera Forma Normal (1FN): Identificación de Tablas y Campos', true);
    S.t.forEach((t) => L('• ' + t.n + ': ' + t.f.map(fl).join(', ')));
    y += 3; L('2. Segunda Forma Normal (2FN): Identificación de DFD y DFT', true);
    S.t.forEach((t) => {
      const d = S.d[t.id] || {};
      L(`• ${t.n} | PK: ${d.pk || '—'} | DFD: ${d.dfd || '—'} | DFT: ${d.no ? 'No hay' : d.dft || '—'}${d.obs ? ' | Obs.: ' + d.obs : ''}`);
    });
    y += 3; L('3. Tercera Forma Normal (3FN): Relaciones', true);
    S.r.forEach((r) => L(`• ${T(r.a).n} ${r.c} ${T(r.b).n}`));
    if (!S.r.length) L('Sin relaciones registradas.');
    P.addPage();
  }

  head('Modelo lógico final');
  const b = bbox(S.t);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${b.w}" height="${b.h}" viewBox="${b.x} ${b.y} ${b.w} ${b.h}" font-family="Arial, Helvetica, sans-serif"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#fff"/>${dgContent(S, null, null, false)}</svg>`;
  const img = new Image();
  await new Promise((ok, no) => {
    img.onload = ok; img.onerror = no;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
  const sc = Math.min(2.5, 3200 / Math.max(b.w, b.h));
  const c = document.createElement('canvas');
  c.width = b.w * sc; c.height = b.h * sc;
  const cx = c.getContext('2d');
  cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
  cx.drawImage(img, 0, 0, c.width, c.height);
  const bw = 269, bh = 160, k = Math.min(bw / b.w, bh / b.h);
  P.addImage(c.toDataURL('image/png'), 'PNG', 14 + (bw - b.w * k) / 2, 36 + (bh - b.h * k) / 2, b.w * k, b.h * k);
  P.save((full ? 'proceso_' : 'modelo_logico_') + S.p.name.replace(/[^\w]+/g, '_') + '.pdf');
}
