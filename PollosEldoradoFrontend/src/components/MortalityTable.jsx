
function MortalityTable({ registros }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Galpón</th>
            <th>Aves muertas</th>
            <th>Observación</th>
          </tr>
        </thead>

        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.fecha}</td>
              <td>Galpón {registro.galpon}</td>
              <td>{registro.muertas}</td>
              <td>{registro.observacion || "Sin observación"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {registros.length === 0 && (
        <p>No hay registros de mortalidad todavía.</p>
      )}
    </div>
  );
}

export default MortalityTable;
