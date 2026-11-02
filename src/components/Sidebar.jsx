import { useC } from '../context.js';
import { ST, dn } from '../lib/progress.js';

export default function Sidebar() {
  const { S, go } = useC();
  const current = S.step + 1;
  return (
    <nav className="sidebar" aria-label="Etapas de normalización">
      <div className="sidebar-heading">
        <span className="sidebar-kicker">GUÍA DE TRABAJO</span>
        <strong>Proceso de normalización</strong>
        <small>Avanza por las etapas de tu modelo</small>
      </div>
      <div className="progress-caption"><span>Etapa actual</span><b>{current} de {ST.length}</b></div>
      <div className="pg" role="progressbar" aria-label="Etapa actual del proceso" aria-valuemin="1" aria-valuemax={ST.length} aria-valuenow={current}><i style={{ width: `${(current / ST.length) * 100}%` }} /></div>
      <div className="step-list">
        {ST.map((s, i) => (
          <button key={i} className={i === S.step ? 'on' : ''} aria-current={i === S.step ? 'step' : undefined} onClick={() => go(i)}>
            <span className="step-number">{dn[i] && dn[i](S) ? '✓' : String(i + 1).padStart(2, '0')}</span><span className="step-label">{s}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-note"><span className="note-icon">i</span><span>Tu avance se guarda automáticamente en este navegador.</span></div>
    </nav>
  );
}
