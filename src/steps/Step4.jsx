import { useState } from 'react';
import { useC } from '../context.js';
import Diagram from '../components/Diagram.jsx';
import { uid } from '../lib/actions.js';

function MMCard({ r }) {
  const { S, upd, ask, bumpFit } = useC();
  const a = S.t.find((t) => t.id === r.a), b = S.t.find((t) => t.id === r.b);
  const [nv, setNv] = useState((a.n || 'A') + '_' + (b.n || 'B'));
  const [ex, setEx] = useState('');
  const run = () => {
    const name = nv.trim();
    if (!name) return ask('Asigna un nombre a la tabla intermedia.');
    ask(`Se reemplazará la relación ${a.n} M:M ${b.n} por ${a.n} 1:M ${name} y ${b.n} 1:M ${name}. ¿Continuar?`, () => {
      upd((n) => {
        const A = n.t.find((t) => t.id === r.a), B = n.t.find((t) => t.id === r.b);
        const pk = (t) => { const f = t.f.find((f) => /PK/.test(f.k)) || t.f[0]; return f ? f.n : 'id' + t.n; };
        let pa = pk(A), pb = pk(B);
        if (pa === pb) { pa = A.n + '_' + pa; pb = B.n + '_' + pb; }
        const nt = {
          id: uid(n, 't'), n: name, x: Math.round((A.x + B.x) / 2), y: Math.round((A.y + B.y) / 2) + 60,
          f: [{ n: pa, k: 'PK/FK' }, { n: pb, k: 'PK/FK' }, ...ex.split(',').map((s) => s.trim()).filter(Boolean).map((x) => ({ n: x, k: '' }))],
        };
        n.t.push(nt);
        n.r = n.r.filter((x) => x.id !== r.id);
        n.r.push({ id: uid(n, 'r'), a: A.id, b: nt.id, c: '1:M' }, { id: uid(n, 'r'), a: B.id, b: nt.id, c: '1:M' });
      });
      bumpFit();
    });
  };
  return (
    <div className="card" style={{ background: 'var(--bg)' }}>
      <b style={{ color: '#e08a00' }}>{a.n || 'Sin nombre'} M:M {b.n || 'Sin nombre'}</b>
      <div className="row" style={{ marginTop: 8 }}>
        <input value={nv} onChange={(e) => setNv(e.target.value)} />
        <input style={{ flex: 1 }} placeholder="Atributos extra (separados por coma)" value={ex} onChange={(e) => setEx(e.target.value)} />
        <button className="btn" onClick={run}>Crear tabla intermedia</button>
      </div>
    </div>
  );
}

export default function Step4() {
  const { S, go } = useC();
  const m = S.r.filter((r) => r.c === 'M:M');
  return (
    <div className="card">
      <h2>4. Eliminación de relaciones M:M y creación de tablas intermedias.</h2>
      <p className="s">Las relaciones M:M aparecen en naranja en el diagrama. Crea la tabla intermedia: sus dos llaves foráneas forman una llave primaria compuesta. Puedes arrastrar las tablas libremente; la distribución se guarda sola.</p>
      {m.map((r) => <MMCard key={r.id} r={r} />)}
      {!m.length && <p className="ok">{S.r.length ? '✓ No quedan relaciones M:M.' : 'Aún no hay relaciones; créalas en 3FN.'}</p>}
      <Diagram />
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn g" onClick={() => go(3)}>← 3FN</button>
        <button className="btn" style={{ marginLeft: 'auto' }} onClick={() => go(5)}>Continuar a exportar →</button>
      </div>
    </div>
  );
}
