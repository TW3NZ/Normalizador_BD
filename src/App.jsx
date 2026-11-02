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
      <div className="app">
        <Sidebar />
        <main><Cur /></main>
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
