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
  // Fecha máxima permitida: hoy.
  const hoy = new Date().toLocaleDateString("en-CA");

  function manejarEnvio(e) {
    e.preventDefault();

    if (!galpon || Number(galpon) < 1 || Number(galpon) > 8) {
      alert("Seleccione un galpón válido entre 1 y 8.");
      return;
    }

    if (!fecha) {
      alert("Seleccione la fecha del registro.");
      return;
    }

    if (fecha > hoy) {
      alert("La fecha del registro no puede ser futura.");
      return;
    }

    if (
      muertas === "" ||
      !Number.isInteger(Number(muertas)) ||
      Number(muertas) <= 0
    ) {
      alert("La cantidad de aves muertas debe ser un número entero mayor que cero.");
      return;
    }

    if (observacion.length > 250) {
      alert("Las observaciones no pueden superar los 250 caracteres.");
      return;
    }

    guardarRegistro(e);
  }

  return (
    <section className="form-card">
      <h1>Registro de mortalidad</h1>

      <form onSubmit={manejarEnvio}>
        <label htmlFor="galpon">Galpón</label>
        <select
          id="galpon"
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

        <label htmlFor="fecha">Fecha del registro</label>
        <input
          id="fecha"
          type="date"
          max={hoy}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <label htmlFor="muertas">Cantidad de aves muertas</label>
        <input
          id="muertas"
          type="number"
          min="1"
          step="1"
          value={muertas}
          onChange={(e) => setMuertas(e.target.value)}
          required
        />

        <label htmlFor="observacion">Observaciones</label>
        <textarea
          id="observacion"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          placeholder="Escriba una observación (máximo 250 caracteres)"
          maxLength={250}
        />

        <button type="submit">Guardar registro</button>
      </form>
    </section>
  );
}

export default MortalityForm;