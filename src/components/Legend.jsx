export default function Legend() {
  return (
    <div className="row" style={{ fontSize: 13, marginBottom: 10 }}>
      <b>Leyenda:</b>
      <span style={{ color: '#d32f2f' }}>■ PK llave primaria</span>
      <span style={{ color: '#2e7d32' }}>■ FK llave foránea</span>
      <span style={{ color: '#1565c0' }}>■ UK llave única</span>
    </div>
  );
}
