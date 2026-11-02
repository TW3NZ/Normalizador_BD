import { useState } from 'react';
import { useC } from '../context.js';

export default function Step0() {
  const { S, upd, ask, go, reset } = useC();
  const [f, setF] = useState(S.p || { name: '', author: '', date: new Date().toISOString().slice(0, 10) });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = () => {
    if (!f.name.trim() || !f.author.trim() || !f.date) return ask('Completa nombre del proyecto, nombre completo y fecha.');
    const nuevo = !S.p;
    upd((n) => { n.p = { name: f.name.trim(), author: f.author.trim(), date: f.date }; });
    if (nuevo) go(1); else ask('Cambios guardados.');
  };
  return (
    <div className="card">
      <h2>Información del proyecto</h2>
      <p className="s">Registra los datos del diseño. Se conservan en este navegador aunque recargues la página.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
        <label>Nombre del proyecto<input value={f.name} onChange={set('name')} /></label>
        <label>Nombre completo de quien realiza el diseño<input value={f.author} onChange={set('author')} /></label>
        <label>Fecha de elaboración<input type="date" value={f.date} onChange={set('date')} /></label>
        <div className="row">
          <button className="btn" onClick={submit}>{S.p ? 'Guardar cambios' : 'Crear proyecto y comenzar'}</button>
          {S.p && <button className="btn d" onClick={() => ask('¿Crear un proyecto nuevo? Se borrarán todos los datos actuales.', reset)}>Nuevo proyecto</button>}
        </div>
      </div>
    </div>
  );
}
