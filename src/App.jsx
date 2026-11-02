import { useEffect, useState } from 'react';
import { Ctx } from './context.js';
import { load, save, fresh } from './lib/storage.js';
import Sidebar from './components/Sidebar.jsx';
import Modal from './components/Modal.jsx';
import Step0 from './steps/Step0.jsx';
import Step1 from './steps/Step1.jsx';
import Step2 from './steps/Step2.jsx';
import Step3 from './steps/Step3.jsx';
import Step4 from './steps/Step4.jsx';
import Step5 from './steps/Step5.jsx';

const STEPS = [Step0, Step1, Step2, Step3, Step4, Step5];

export default function App() {
  const [S, setS] = useState(load);
  const [sel, setSel] = useState(null);
  const [conn, setConn] = useState(false);
  const [first, setFirst] = useState(null);
  const [cd, setCd] = useState('1:M');
  const [fitTick, setFt] = useState(0);
  const [md, setMd] = useState(null);
  const [toast, setToast] = useState(false);

  useEffect(() => { save(S); }, [S]); // persistencia en LocalStorage

  const upd = (fn) => setS((p) => { const n = structuredClone(p); fn(n); return n; });
  const createProject = (project) => {
    const next = { ...S, p: project };
    const persisted = save(next);
    setS(next);
    return persisted;
  };
  const notifyProjectCreated = () => setToast(true);
  const ask = (msg, fn) => setMd({ msg, fn });
  const go = (i, creating = false) => {
    if (i > 0 && !S.p && !creating) { ask('Primero crea el proyecto.'); i = 0; }
    setConn(false); setFirst(null);
    upd((n) => { n.step = i; });
    window.scrollTo(0, 0);
  };
  const reset = () => { setS(fresh()); setSel(null); setConn(false); setFirst(null); };
  const ctx = { S, upd, ask, go, reset, createProject, notifyProjectCreated, sel, setSel, conn, setConn, first, setFirst, cd, setCd, fitTick, bumpFit: () => setFt((x) => x + 1) };
  const Cur = STEPS[S.step] || Step0;

  return (
    <Ctx.Provider value={ctx}>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">NB</span>
            <span className="brand-copy"><strong>Normalizador BD</strong><small>Modelado relacional · herramienta académica</small></span>
          </div>
          <div className="topbar-context">
            <span className="context-label">PROYECTO ACTUAL</span>
            <strong>{S.p?.name || 'Sin proyecto seleccionado'}</strong>
          </div>
          <span className="academic-badge"><i /> Espacio de trabajo</span>
          <a className="author-link" href="https://github.com/TW3NZ" target="_blank" rel="noreferrer" aria-label="by TW3NZ — abrir perfil de GitHub en una pestaña nueva">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.75 2.48 3.75 1.78.1-.72.4-1.21.69-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.76 1.02.76 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>
            <span>by <strong>TW3NZ</strong></span>
          </a>
        </header>
        <div className="app">
          <Sidebar />
          <main><Cur /></main>
        </div>
      </div>
      {toast && <ProjectToast onClose={() => setToast(false)} />}
      {md && <Modal md={md} close={() => setMd(null)} />}
    </Ctx.Provider>
  );
}

function ProjectToast({ onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const enter = window.requestAnimationFrame(() => setVisible(true));
    const close = window.setTimeout(() => setVisible(false), 3700);
    const remove = window.setTimeout(onClose, 4000);
    return () => {
      window.cancelAnimationFrame(enter);
      window.clearTimeout(close);
      window.clearTimeout(remove);
    };
  }, []);

  return (
    <div className={`project-toast${visible ? ' is-visible' : ''}`} role="status" aria-live="polite">
      <span className="toast-check" aria-hidden="true">✓</span>
      <span className="toast-copy"><strong>¡Proyecto creado exitosamente!</strong><span>Tu proyecto ya está listo para comenzar</span></span>
      <button type="button" className="toast-close" aria-label="Cerrar notificación" onClick={() => { setVisible(false); window.setTimeout(onClose, 180); }}>×</button>
    </div>
  );
}
