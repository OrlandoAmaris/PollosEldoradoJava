
function NavigationMenu({ cambiarPantalla }) {
  return (
    <nav className="navigation">
      <button onClick={() => cambiarPantalla("dashboard")}>
        Panel principal
      </button>

      <button onClick={() => cambiarPantalla("registro")}>
        Registrar mortalidad
      </button>

      <button onClick={() => cambiarPantalla("reportes")}>
        Consultar reportes
      </button>
    </nav>
  );
}

export default NavigationMenu;
