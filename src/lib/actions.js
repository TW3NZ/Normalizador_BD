/** Operaciones sobre el modelo. `upd(fn)` aplica fn sobre una copia del estado. */
export const uid = (n, p) => p + n.n++;
const tb = (n, id) => n.t.find((t) => t.id === id);

export const addTable = (upd) => upd((n) => { n.t.push({ id: uid(n, 't'), n: '', f: [] }); });
export const renameTable = (upd, id, v) => upd((n) => { tb(n, id).n = v; });
export const addField = (upd, id) => upd((n) => { tb(n, id).f.push({ n: '', k: '' }); });
export const setField = (upd, id, i, p, v) => upd((n) => { tb(n, id).f[i][p] = v; });

export const delTable = (upd, ask, S, id, after) =>
  ask(`¿Eliminar la tabla "${S.t.find((t) => t.id === id)?.n || 'sin nombre'}" junto con sus relaciones?`, () => {
    upd((n) => {
      n.t = n.t.filter((t) => t.id !== id);
      n.r = n.r.filter((r) => r.a !== id && r.b !== id);
      delete n.d[id];
    });
    after && after();
  });

export const delField = (upd, ask, S, id, i) =>
  ask(`¿Eliminar el campo "${S.t.find((t) => t.id === id).f[i].n || 'sin nombre'}"?`, () =>
    upd((n) => { tb(n, id).f.splice(i, 1); })
  );

export const setDep = (upd, id, p, v) =>
  upd((n) => {
    const d = (n.d[id] = n.d[id] || {});
    d[p] = v;
    if (p === 'pk') {
      const f = tb(n, id).f.find((f) => f.n === v);
      if (f && !/PK/.test(f.k)) f.k = 'PK';
    }
  });

export const demo = (upd) =>
  upd((n) => {
    const m = (name, f) => ({ id: uid(n, 't'), n: name, f: f.map(([a, b]) => ({ n: a, k: b })) });
    const a = m('Autor', [['coAutor', 'PK'], ['nomAutor', '']]);
    const l = m('Libro', [['coLibro', 'PK'], ['nomLibro', ''], ['coEditorial', 'FK']]);
    const e = m('Editorial', [['coEditorial', 'PK'], ['nomEditorial', '']]);
    n.t.push(a, l, e);
    n.r.push({ id: uid(n, 'r'), a: a.id, b: l.id, c: 'M:M' }, { id: uid(n, 'r'), a: e.id, b: l.id, c: '1:M' });
  });
