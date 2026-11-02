import { useC } from '../context.js';
import Legend from '../components/Legend.jsx';
import Diagram from '../components/Diagram.jsx';
import FieldRow from '../components/FieldRow.jsx';
import { addTable, renameTable, addField, delTable } from '../lib/actions.js';

export default function Step3() {
  const { S, upd, ask, go, sel, setSel, conn, setConn, setFirst, cd, setCd } = useC();
  const t = S.t.find((x) => x.id === sel);
  const nm = (id) => S.t.find((x) => x.id === id)?.n || 'Sin nombre';
  const extra = (
    <>
      <button className="btn" onClick={() => addTable(upd)}>+ Tabla</button>
      <button className={'btn ' + (conn ? '' : 'g')} onClick={() => { setConn(!conn); setFirst(null); }}>
        {conn ? 'Conectando… elige 2 tablas' : 'Conectar tablas'}
      </button>
      <label className="inl">Cardinalidad&nbsp;
        <select value={cd} onChange={(e) => setCd(e.target.value)}>{['1:M', '1:1', 'M:M'].map((c) => <option key={c}>{c}</option>)}</select>
      </label>
    </>
  );
  return (
    <div className="card">
      <h2>3. Tercera Forma Normal (3FN): Eliminar DFT y Establecer Relaciones.</h2>
      <p className="s">Arrastra los recuadros para organizarlos. Para relacionar: pulsa “Conectar”, elige la tabla del lado “1” y luego la otra.</p>
      <Legend />
      <div className="wrap">
        <div style={{ flex: '1 1 520px', minWidth: 0 }}><Diagram edit extra={extra} /></div>
        <div style={{ flex: '0 0 280px' }}>
          {t ? (
            <div className="card" style={{ margin: 0 }}>
              <b>Tabla seleccionada</b>
              <input style={{ margin: '6px 0', width: '100%' }} placeholder="Nombre" value={t.n} onChange={(e) => renameTable(upd, t.id, e.target.value)} />
              {t.f.map((f, i) => <FieldRow key={i} t={t} f={f} i={i} />)}
              <div className="row">
                <button className="btn g" onClick={() => addField(upd, t.id)}>+ Campo</button>
                <button className="btn d" onClick={() => delTable(upd, ask, S, t.id, () => setSel(null))}>Eliminar tabla</button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ margin: 0, color: 'var(--mu)', fontSize: 13 }}>
              Selecciona una tabla para editar sus campos. Rueda del ratón = zoom; arrastra el fondo para desplazarte.
            </div>
          )}
        </div>
      </div>
      <div className="card" style={{ margin: '12px 0 0' }}>
        <b>Relaciones</b><br /><br />
        {S.r.map((r) => (
          <div className="fl" key={r.id}>
            {nm(r.a)}
            <select value={r.c} onChange={(e) => upd((n) => { n.r.find((x) => x.id === r.id).c = e.target.value; })}>
              {['1:1', '1:M', 'M:M'].map((c) => <option key={c}>{c}</option>)}
            </select>
            {nm(r.b)}
            <button className="btn g" title="Invertir" onClick={() => upd((n) => { const x = n.r.find((q) => q.id === r.id); [x.a, x.b] = [x.b, x.a]; })}>⇄</button>
            <button className="btn d" onClick={() => ask('¿Eliminar esta relación?', () => upd((n) => { n.r = n.r.filter((x) => x.id !== r.id); }))}>Eliminar</button>
          </div>
        ))}
        {!S.r.length && <span style={{ color: 'var(--mu)' }}>Sin relaciones todavía.</span>}
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn g" onClick={() => go(2)}>← 2FN</button>
        <button className="btn" style={{ marginLeft: 'auto' }} onClick={() => go(4)}>Continuar →</button>
      </div>
    </div>
  );
}
