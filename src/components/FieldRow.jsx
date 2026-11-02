import { useC } from '../context.js';
import { KT, kc } from '../lib/geometry.js';
import { setField, delField } from '../lib/actions.js';

export default function FieldRow({ t, f, i }) {
  const { S, upd, ask } = useC();
  return (
    <div className="fl">
      <input style={{ color: kc(f.k), fontWeight: 600 }} placeholder="campo" value={f.n}
        onChange={(e) => setField(upd, t.id, i, 'n', e.target.value)} />
      <select value={f.k} onChange={(e) => setField(upd, t.id, i, 'k', e.target.value)}>
        {KT.map((k) => <option key={k} value={k}>{k || 'Sin clave'}</option>)}
      </select>
      <button className="btn d" onClick={() => delField(upd, ask, S, t.id, i)}>✕</button>
    </div>
  );
}
