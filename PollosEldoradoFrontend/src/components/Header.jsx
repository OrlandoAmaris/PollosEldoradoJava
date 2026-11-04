
function Header({ usuario, cerrarSesion }) {
  return (
    <header className="header">
      <div>
        <h2>POLLOS ELDORADO</h2>
        <span>Sistema de Gestión Avícola</span>
        <small className="user-label">
          Usuario: {usuario}
        </small>
      </div>

      <button className="logout" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </header>
  );
}

export default Header;
