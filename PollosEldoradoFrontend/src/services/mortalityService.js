
const API_URL = "/api/registro-mortalidad?format=json";

async function procesarRespuesta(respuesta) {
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      resultado.mensaje || "Error en la comunicación con Java."
    );
  }

  return resultado;
}

export async function consultarRegistros() {
  const respuesta = await fetch(
    "/api/registro-mortalidad?format=json",
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!respuesta.ok) {
    throw new Error("No se pudieron consultar los registros de Java");
  }

  const resultado = await respuesta.json();

  return (resultado.registros || []).map((registro) => ({
    id: registro.idRegistro,
    fecha: registro.fecha,
    galpon: registro.galpon,
    muertas: registro.cantidad,
    causaProbable: registro.causaProbable || "No especificada",
    observacion: registro.observaciones || "",
  }));
}

export async function guardarRegistroJava(registro) {
  const datos = new URLSearchParams();

  datos.append("accion", "guardar");
  datos.append("fecha", registro.fecha);
  datos.append("galpon", registro.galpon);
  datos.append("cantidad", registro.muertas);
  datos.append(
    "causaProbable",
    registro.causaProbable || "No especificada"
  );
  datos.append("observaciones", registro.observacion || "");

  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: datos.toString(),
  });

  return procesarRespuesta(respuesta);
}
