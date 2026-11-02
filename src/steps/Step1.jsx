import { useC } from '../context.js';
import Legend from '../components/Legend.jsx';
import FieldRow from '../components/FieldRow.jsx';
import { addTable, renameTable, addField, delTable, demo } from '../lib/actions.js';

export default function Step1() {
  const { S, upd, ask, go } = useC();
  return (
    <div className="card">
      <h2>1. Primera Forma Normal (1FN): Identificación de Tablas y Campos.</h2>
      <p className="s">Registra cada tabla y sus campos; marca el tipo de clave de cada uno.</p>
      <Legend />
      <div style={{ overflowX: 'auto' }}>
        <table className="t">
          <thead><tr><th style={{ width: '28%' }}>Tabla</th><th>Campos</th></tr></thead>
          <tbody>
            {S.t.map((t) => (
              <tr key={t.id}>
                <td>
                  <input placeholder="Nombre de la tabla" value={t.n} onChange={(e) => renameTable(upd, t.id, e.target.value)} />
                  <br /><br />
                  <button className="btn d" onClick={() => delTable(upd, ask, S, t.id)}>Eliminar tabla</button>
                </td>
                <td>
                  {t.f.map((f, i) => <FieldRow key={i} t={t} f={f} i={i} />)}
                  <button className="btn g" onClick={() => addField(upd, t.id)}>+ Campo</button>
                </td>
              </tr>
            ))}
            {!S.t.length && <tr><td colSpan="2" style={{ color: 'var(--mu)' }}>Aún no hay tablas. Agrega la primera.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn" onClick={() => addTable(upd)}>+ Agregar tabla</button>
        <button className="btn g" onClick={() => demo(upd)}>Cargar ejemplo de demostración (eliminable)</button>
        <button className="btn" style={{ marginLeft: 'auto' }} onClick={() => go(2)}>Continuar a 2FN →</button>
      </div>
    </div>
  );
}
