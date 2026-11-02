export const ST = [
  'Información del proyecto',
  '1FN · Tablas y campos',
  '2FN · DFD y DFT',
  '3FN · Relaciones',
  'Eliminar M:M',
  'Exportar modelo',
];

export const dn = [
  (S) => !!S.p,
  (S) => S.t.length > 0 && S.t.every((t) => t.f.length > 0),
  (S) =>
    S.t.length > 0 &&
    S.t.every((t) => {
      const d = S.d[t.id] || {};
      return !!(d.pk && d.dfd && (d.no || d.dft));
    }),
  (S) => S.r.length > 0,
  (S) => S.r.length > 0 && !S.r.some((r) => r.c === 'M:M'),
];
