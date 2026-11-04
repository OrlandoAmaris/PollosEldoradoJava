import { useState } from "react";

import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";
import MortalityForm from "./components/MortalityForm";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  const [pantalla, setPantalla] = useState("login");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  const [registros, setRegistros] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("registrosMortalidad")) || [];
  } catch {
    return [];
  }
});

  const [galpon, setGalpon] = useState("");
  const [fecha, setFecha] = useState("");
  const [muertas, setMuertas] = useState("");
  const [observacion, setObservacion] = useState("");

  function iniciarSesion(e) {
    e.preventDefault();

    if (!usuario.trim() || !clave.trim()) {
      alert("Ingrese usuario y contraseña.");
      return;
    }

    // Acceso de demostración. Luego se conectará con Java.
    setPantalla("dashboard");
  }

  function cerrarSesion() {
    setUsuario("");
    setClave("");
    setPantalla("login");
  }

  function guardarRegistro(e) {
  e.preventDefault();

  // Validar que se seleccione un galpón.
  if (!galpon) {
    alert("Debe seleccionar un galpón.");
    return;
  }

  // Validar que se ingrese una fecha.
  if (!fecha) {
    alert("Debe seleccionar la fecha del registro.");
    return;
  }

  // Validar que la cantidad sea un número entero no negativo.
  const cantidad = Number(muertas);

  if (
    muertas === "" ||
    !Number.isInteger(cantidad) ||
    cantidad < 0
  ) {
    alert("La cantidad de aves debe ser un número entero igual o mayor a cero.");
    return;
  }

  // Validar que la fecha no sea posterior al día actual.
  const hoy = new Date();
  const fechaActual = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0")
  ].join("-");

  if (fecha > fechaActual) {
    alert("La fecha del registro no puede ser futura.");
    return;
  }

  const nuevoRegistro = {
    id: Date.now(),
    galpon,
    fecha,
    muertas: cantidad,
    observacion: observacion.trim()
  };

  const actualizados = [...registros, nuevoRegistro];

  setRegistros(actualizados);

  localStorage.setItem(
    "registrosMortalidad",
    JSON.stringify(actualizados)
  );

  setGalpon("");
  setFecha("");
  setMuertas("");
  setObservacion("");

  alert("Registro guardado correctamente.");
  setPantalla("reportes");
}


  const totalMuertas = registros.reduce(
    (total, registro) => total + registro.muertas,
    0
  );

  return (
    <div className="app-container">
      {pantalla === "login" && (
        <main className="login-container">
          <div className="login-card">
            <div className="logo-area">
              <div className="logo-circle">PE</div>
              <h1>POLLOS ELDORADO</h1>
              <p>Sistema de Control de Mortalidad</p>
            </div>

            <form onSubmit={iniciarSesion}>
              <label>Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingrese su usuario"
              />

              <label>Contraseña</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="Ingrese su contraseña"
              />

              <button type="submit">INICIAR SESIÓN</button>
            </form>
          </div>
        </main>
      )}

      {pantalla !== "login" && (
        <>
          <Header usuario={usuario} cerrarSesion={cerrarSesion} />

          <NavigationMenu cambiarPantalla={setPantalla} />

          <main className="content">
            {pantalla === "dashboard" && (
              <section>
                <h1>Panel principal</h1>
                <p>Bienvenido, {usuario}</p>

                <div className="summary-grid">
                  <article className="summary-card">
                    <h3>Registros realizados</h3>
                    <strong>{registros.length}</strong>
                  </article>

                  <article className="summary-card">
                    <h3>Total de aves muertas</h3>
                    <strong>{totalMuertas}</strong>
                  </article>
                </div>

                <button onClick={() => setPantalla("registro")}>
                  Registrar mortalidad
                </button>
              </section>
            )}

            {pantalla === "registro" && (
              <MortalityForm
                galpon={galpon}
                setGalpon={setGalpon}
                fecha={fecha}
                setFecha={setFecha}
                muertas={muertas}
                setMuertas={setMuertas}
                observacion={observacion}
                setObservacion={setObservacion}
                guardarRegistro={guardarRegistro}
              />
            )}

            {pantalla === "reportes" && (
              <Reports
                registros={registros}
                totalMuertas={totalMuertas}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}
export default App;
