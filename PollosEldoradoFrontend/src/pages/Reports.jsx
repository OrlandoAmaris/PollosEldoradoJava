

import { useState } from "react";
import MortalityTable from "../components/MortalityTable";
import FiltersBar from "../components/FiltersBar";

function Reports({ registros, totalMuertas }) {
  const [filtroGalpon, setFiltroGalpon] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // Aplica los filtros seleccionados por el usuario.
  const registrosFiltrados = registros.filter((registro) => {
    const coincideGalpon =
      filtroGalpon === "" || String(registro.galpon) === filtroGalpon;

    const coincideFecha =
      filtroFecha === "" || registro.fecha === filtroFecha;

    return coincideGalpon && coincideFecha;
  });

  // Calcula el total de aves muertas según los filtros.
  const totalFiltrado = registrosFiltrados.reduce(
    (total, registro) => total + registro.muertas,
    0
  );

  function limpiarFiltros() {
    setFiltroGalpon("");
    setFiltroFecha("");
  }

  return (
    <section>
      <h1>Consulta de reportes</h1>

      <FiltersBar
        filtroGalpon={filtroGalpon}
        setFiltroGalpon={setFiltroGalpon}
        filtroFecha={filtroFecha}
        setFiltroFecha={setFiltroFecha}
        limpiarFiltros={limpiarFiltros}
      />

      <div className="summary-card">
        <h3>Total de aves muertas según consulta</h3>
        <strong>{totalFiltrado}</strong>
      </div>

      <p>
        Registros encontrados: {registrosFiltrados.length}
      </p>

      <MortalityTable registros={registrosFiltrados} />
    </section>
  );
}

export default Reports;
