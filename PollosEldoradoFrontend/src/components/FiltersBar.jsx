
function FiltersBar({
  filtroGalpon,
  setFiltroGalpon,
  filtroFecha,
  setFiltroFecha,
  limpiarFiltros
}) {
  return (
    <div className="filters-bar">
      <div>
        <label>Filtrar por galpón</label>
        <select
          value={filtroGalpon}
          onChange={(e) => setFiltroGalpon(e.target.value)}
        >
          <option value="">Todos los galpones</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((numero) => (
            <option key={numero} value={String(numero)}>
              Galpón {numero}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Filtrar por fecha</label>
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
      </div>

      <button type="button" onClick={limpiarFiltros}>
        Limpiar filtros
      </button>
    </div>
  );
}

export default FiltersBar;
