export default function Modal({ md, close }) {
  return (
    <div className="md">
      <div className="card" style={{ maxWidth: 430, margin: 0 }}>
        <p>{md.msg}</p>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          {md.fn && <button className="btn g" onClick={close}>Cancelar</button>}
          <button className="btn" onClick={() => { close(); md.fn && md.fn(); }}>{md.fn ? 'Confirmar' : 'Entendido'}</button>
        </div>
      </div>
    </div>
  );
}
