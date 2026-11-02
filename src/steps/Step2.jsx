import { useC } from '../context.js';
import { kc } from '../lib/geometry.js';
import { setDep } from '../lib/actions.js';

export default function Step2() {
  const { S, upd, go } = useC();
  return (
    <div className="card">
      <h2>2. Segunda Forma Normal (2FN): Identificación de DFD y DFT.</h2>
      <p className="s">Elige la llave primaria, describe la dependencia funcional directa y confirma tú mismo si existen o no dependencias transitivas. No se asume nada automáticamente.</p>
      <div style={{ overflowX: 'auto' }}>
        <table className="t">
          <thead><tr><th>Tabla</th><th>Campos</th><th>DFD (Llave primaria)</th><th>DFT (Dependencia transitiva)</th></tr></thead>
          <tbody>
            {S.t.map((t) => {
              const d = S.d[t.id] || {}, ok = d.pk && d.dfd && (d.no || d.dft);
              return (
                <tr key={t.id}>
                  <td><b>{t.n || 'Sin nombre'}</b></td>
                  <td>{t.f.map((f, i) => (
                    <span key={i}><span style={{ color: kc(f.k), fontWeight: 600 }}>{f.n}{f.k ? ` (${f.k})` : ''}</span>{i < t.f.length - 1 ? ', ' : ''}</span>
                  ))}</td>
                  <td style={{ minWidth: 200 }}>
                    PK: <select value={d.pk || ''} onChange={(e) => setDep(upd, t.id, 'pk', e.target.value)}>
                      <option value="">Elegir…</option>
                      {t.f.map((f, i) => <option key={i} value={f.n}>{f.n}</option>)}
                    </select>
                    <textarea rows="3" placeholder="Ej.: Todos los campos dependen de la PK" value={d.dfd || ''} onChange={(e) => setDep(upd, t.id, 'dfd', e.target.value)} />
                    <button className="btn g" onClick={() => d.pk && setDep(upd, t.id, 'dfd', 'Todos los campos dependen de ' + d.pk)}>Sugerir texto</button>
                  </td>
                  <td style={{ minWidth: 220 }}>
                    <textarea rows="3" placeholder="Campos que dependen de otro campo no clave" value={d.dft || ''} onChange={(e) => setDep(upd, t.id, 'dft', e.target.value)} />
                    <label className="inl" style={{ color: 'var(--tx)' }}>
                      <input type="checkbox" checked={!!d.no} onChange={(e) => setDep(upd, t.id, 'no', e.target.checked)} /> Confirmo: no hay dependencias transitivas
                    </label>
                    <textarea rows="2" placeholder="Observaciones" value={d.obs || ''} onChange={(e) => setDep(upd, t.id, 'obs', e.target.value)} />
                    <div className={ok ? 'ok' : ''} style={{ fontSize: 13 }}>{ok ? '✓ Analizada' : 'Pendiente'}</div>
                  </td>
                </tr>
              );
            })}
            {!S.t.length && <tr><td colSpan="4">Primero registra tablas en 1FN.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn g" onClick={() => go(1)}>← 1FN</button>
        <button className="btn" style={{ marginLeft: 'auto' }} onClick={() => go(3)}>Continuar a 3FN →</button>
      </div>
    </div>
  );
}
