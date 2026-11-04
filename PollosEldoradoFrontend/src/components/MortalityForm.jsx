
function MortalityForm({
  galpon,
  setGalpon,
  fecha,
  setFecha,
  muertas,
  setMuertas,
  observacion,
  setObservacion,
  guardarRegistro
}) {
  return (
    <section className="form-card">
      <h1>Registro de mortalidad</h1>

      <form onSubmit={guardarRegistro}>
        <label>Galpón</label>
        <select
          value={galpon}
          onChange={(e) => setGalpon(e.target.value)}
          required
        >
          <option value="">Seleccione un galpón</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((numero) => (
            <option key={numero} value={numero}>
              Galpón {numero}
            </option>
          ))}
        </select>

        <label>Fecha del registro</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <label>Cantidad de aves muertas</label>
        <input
          type="number"
          min="0"
          step="1"
          value={muertas}
          onChange={(e) => setMuertas(e.target.value)}
          required
        />

        <label>Observaciones</label>
        <textarea
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          placeholder="Escriba una observación"
        />

        <button type="submit">Guardar registro</button>
      </form>
    </section>
  );
}

export default MortalityForm;
