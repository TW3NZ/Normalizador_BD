import { useC } from '../context.js';
import Diagram from '../components/Diagram.jsx';
import { exportPdf } from '../lib/pdf.js';

export default function Step5() {
  const { S, ask, go } = useC();
  const run = async (full) => {
    if (!S.t.length) return ask('No hay tablas para exportar.');
    try { await exportPdf(S, full); } catch (e) { ask('No se pudo generar el PDF.'); }
  };
  return (
    <div className="card">
      <h2>Exportación del modelo lógico</h2>
      <p className="s">El PDF incluye proyecto, autor, fecha y el diagrama tal como lo organizaste.</p>
      <div className="row" style={{ marginBottom: 14 }}>
        <button className="btn" onClick={() => run(false)}>Exportar modelo lógico a PDF</button>
        <button className="btn g" onClick={() => run(true)}>Exportar proceso completo a PDF</button>
        <button className="btn g" onClick={() => go(4)}>← Volver</button>
      </div>
      <Diagram height={520} />
    </div>
  );
}
