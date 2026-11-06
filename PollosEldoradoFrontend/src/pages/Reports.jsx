import { useState } from "react";
import MortalityTable from "../components/MortalityTable";

function Reports({ registros, cargando, error }) {
  const [filtroGalpon, setFiltroGalpon] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Aplica los filtros seleccionados por el usuario.
  const registrosFiltrados = registros.filter((registro) => {
    const coincideGalpon =
      filtroGalpon === "todos" ||
      String(registro.galpon) === filtroGalpon;

    const coincideFechaDesde =
      fechaDesde === "" || registro.fecha >= fechaDesde;

    const coincideFechaHasta =
      fechaHasta === "" || registro.fecha <= fechaHasta;

    return (
      coincideGalpon &&
      coincideFechaDesde &&
      coincideFechaHasta
    );
  });

  // Calcula el total de aves muertas según los filtros.
  const totalFiltrado = registrosFiltrados.reduce(
    (total, registro) => total + Number(registro.muertas || 0),
    0
  );

  // Agrupa la mortalidad por galpón.
const resumenPorGalpon = registrosFiltrados.reduce(
  (resumen, registro) => {
    const galpon = registro.galpon;

    if (!resumen[galpon]) {
      resumen[galpon] = {
        galpon,
        totalMuertas: 0,
        cantidadRegistros: 0,
      };
    }

    resumen[galpon].totalMuertas += Number(registro.muertas || 0);
    resumen[galpon].cantidadRegistros += 1;

    return resumen;
  },
  {}
);

const resumenGalpones = Object.values(resumenPorGalpon).sort(
  (a, b) => Number(a.galpon) - Number(b.galpon)
);

  // Restablece todos los filtros.
  function limpiarFiltros() {
    setFiltroGalpon("todos");
    setFechaDesde("");
    setFechaHasta("");
  }

  // Exporta los registros filtrados a un archivo CSV compatible con Excel.
function exportarCSV() {
  const encabezados = [
    "ID",
    "Fecha",
    "Galpon",
    "Aves muertas",
    "Causa probable",
    "Observaciones",
  ];

  const filas = registrosFiltrados.map((registro) => [
    registro.id,
    registro.fecha,
    registro.galpon,
    registro.muertas,
    registro.causaProbable || "No especificada",
    registro.observacion || "",
  ]);

  // Escapa comillas y valores que puedan contener separadores.
  const convertirCSV = (valor) => {
    const texto = String(valor ?? "").replace(/"/g, '""');
    return `"${texto}"`;
  };

  const contenido = [encabezados, ...filas]
    .map((fila) => fila.map(convertirCSV).join(";"))
    .join("\r\n");

  // BOM para que Excel reconozca correctamente caracteres como ñ y tildes.
  const archivo = new Blob(["\uFEFF" + contenido], {
    type: "text/csv;charset=utf-8;",
  });

  const enlace = document.createElement("a");
  const url = URL.createObjectURL(archivo);

  enlace.href = url;
  enlace.download = "Reporte_Mortalidad_Pollos_ElDorado.csv";

  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);

  URL.revokeObjectURL(url);
}

  return (
    <section>
      <h1>Consulta de reportes</h1>
      <button
      type="button"
      onClick={exportarCSV}
      disabled={registrosFiltrados.length === 0}
      >
        Exportar reporte a Excel (CSV)
      </button>

      <div className="filtros-reportes">
        <div>
          <label htmlFor="filtroGalpon">Galpón:</label>

          <select
            id="filtroGalpon"
            value={filtroGalpon}
            onChange={(e) => setFiltroGalpon(e.target.value)}
          >
            <option value="todos">Todos los galpones</option>
            <option value="1">Galpón 1</option>
            <option value="2">Galpón 2</option>
            <option value="3">Galpón 3</option>
            <option value="4">Galpón 4</option>
            <option value="5">Galpón 5</option>
            <option value="6">Galpón 6</option>
            <option value="7">Galpón 7</option>
            <option value="8">Galpón 8</option>
          </select>
        </div>

        <div>
          <label htmlFor="fechaDesde">Desde:</label>

          <input
            id="fechaDesde"
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="fechaHasta">Hasta:</label>

          <input
            id="fechaHasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>

        <button type="button" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      {cargando && (
        <p>Cargando registros desde la base de datos...</p>
      )}

      {error && <p>{error}</p>}

      <div className="summary-card">
        <h3>Total de aves muertas según consulta</h3>
        <strong>{totalFiltrado}</strong>
      </div>

      <div className="summary-card">
  <h3>Resumen de mortalidad por galpón</h3>

  {resumenGalpones.length === 0 ? (
    <p>No hay registros para los filtros seleccionados.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Galpón</th>
          <th>Total de aves muertas</th>
          <th>Registros</th>
        </tr>
      </thead>

      <tbody>
        {resumenGalpones.map((item) => (
          <tr key={item.galpon}>
            <td>Galpón {item.galpon}</td>
            <td>{item.totalMuertas}</td>
            <td>{item.cantidadRegistros}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

      <p>Registros encontrados: {registrosFiltrados.length}</p>

      <MortalityTable registros={registrosFiltrados} />
    </section>
  );
}

export default Reports;