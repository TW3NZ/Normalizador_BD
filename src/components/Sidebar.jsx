import { useC } from '../context.js';
import { ST, dn } from '../lib/progress.js';

export default function Sidebar() {
  const { S, go } = useC();
  const done = dn.filter((f) => f(S)).length;
  return (
    <nav>
      <h1>Normalizador BD</h1>
      <div className="pg"><i style={{ width: `${done * 20}%` }} /></div>
      {ST.map((s, i) => (
        <button key={i} className={i === S.step ? 'on' : ''} onClick={() => go(i)}>
          <span>{dn[i] && dn[i](S) ? '✓' : i + 1}</span>{s}
        </button>
      ))}
    </nav>
  );
}
