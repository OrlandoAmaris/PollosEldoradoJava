import { useState, useEffect } from "react";

import Header from "./components/Header";
import NavigationMenu from "./components/NavigationMenu";
import MortalityForm from "./components/MortalityForm";
import Reports from "./pages/Reports";
import { guardarRegistroJava } from "./services/mortalityService";
import { consultarRegistros } from "./services/mortalityService";

import "./App.css";

function App() {
  const [pantalla, setPantalla] = useState("login");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

 const [registros, setRegistros] = useState([]);
const [cargandoRegistros, setCargandoRegistros] = useState(true);
const [errorRegistros, setErrorRegistros] = useState("");


  const [galpon, setGalpon] = useState("");
  const [fecha, setFecha] = useState("");
  const [muertas, setMuertas] = useState("");
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
  async function cargarRegistrosDesdeJava() {
    try {
      setCargandoRegistros(true);
      setErrorRegistros("");

      const datos = await consultarRegistros();

      setRegistros(datos);
    } catch (error) {
      console.error("Error consultando registros:", error);
      setErrorRegistros(
        "No fue posible cargar los registros desde Java. Verifica que Tomcat esté iniciado."
      );
    } finally {
      setCargandoRegistros(false);
    }
  }

  cargarRegistrosDesdeJava();
}, []);

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


async function guardarRegistro(e) {
  e.preventDefault();

  if (!galpon) {
    alert("Debe seleccionar un galpón.");
    return;
  }

  if (!fecha) {
    alert("Debe seleccionar la fecha del registro.");
    return;
  }

  const cantidad = Number(muertas);

  if (
    muertas === "" ||
    !Number.isInteger(cantidad) ||
    cantidad < 1
  ) {
    alert("La cantidad de aves debe ser un número entero mayor que cero.");
    return;
  }

  const hoy = new Date();
  const fechaActual = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
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
    causaProbable: "No especificada",
    observacion: observacion.trim(),
  };

  try {
    await guardarRegistroJava(nuevoRegistro);

    const datosActualizados = await consultarRegistros();

    setRegistros(datosActualizados);

    setGalpon("");
    setFecha("");
    setMuertas("");
    setObservacion("");

    alert("Registro guardado correctamente en Java.");
    setPantalla("reportes");
  } catch (error) {
    console.error(error);
    alert(
      "No fue posible guardar el registro en Java. Verifique que Tomcat esté activo."
    );
  }
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
                cargando={cargandoRegistros}
                error={errorRegistros}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}
export default App;
