package com.polloseldorado.controlador;

import com.polloseldorado.dao.RegistroMortalidadDAO;
import com.polloseldorado.modelo.RegistroMortalidad;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador web para registrar, consultar, actualizar y eliminar
 * registros de mortalidad de aves.
 */
@WebServlet("/registro-mortalidad")
public class RegistroMortalidadServlet extends HttpServlet {

    private final RegistroMortalidadDAO registroMortalidadDAO =
            new RegistroMortalidadDAO();
    private boolean esSolicitudJSON(HttpServletRequest request) {
    return "json".equalsIgnoreCase(request.getParameter("format"))
            || request.getHeader("Accept") != null
            && request.getHeader("Accept").contains("application/json");
}

private String escaparJSON(String texto) {
    if (texto == null) {
        return "";
    }

    return texto
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
}

private void responderJSON(HttpServletResponse response,
                           int estado,
                           String contenido) throws IOException {
    response.setStatus(estado);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write(contenido);
}

    /** Consulta los registros y prepara los datos de edición cuando aplica. */
    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        String accion = request.getParameter("accion");

        if ("editar".equals(accion)) {
            try {
                int idRegistro = leerEnteroPositivo(
                        request.getParameter("idRegistro"), "identificador");
                RegistroMortalidad registro =
                        registroMortalidadDAO.obtenerPorId(idRegistro);

                if (registro == null) {
                    guardarMensaje(request, "No se encontró el registro solicitado.", "error");
                } else {
                    request.setAttribute("registroEditar", registro);
                }
            } catch (IllegalArgumentException error) {
                guardarMensaje(request, error.getMessage(), "error");
            }
        }

        if (esSolicitudJSON(request)) {
    List<RegistroMortalidad> registros =
            registroMortalidadDAO.consultarRegistros();

    String json = registros.stream()
            .map(registro -> "{"
                    + "\"idRegistro\":" + registro.getIdRegistro() + ","
                    + "\"fecha\":\"" + escaparJSON(
                            registro.getFecha().toString()) + "\","
                    + "\"galpon\":" + registro.getGalpon() + ","
                    + "\"cantidad\":" + registro.getCantidad() + ","
                    + "\"causaProbable\":\"" + escaparJSON(
                            registro.getCausaProbable()) + "\","
                    + "\"observaciones\":\"" + escaparJSON(
                            registro.getObservaciones()) + "\""
                    + "}")
            .collect(Collectors.joining(",", "[", "]"));

    responderJSON(response, 200, "{\"registros\":" + json + "}");
    return;
}

cargarRegistros(request, response);
    }

    /** Procesa las operaciones enviadas desde los formularios de la vista. */
    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        String accion = request.getParameter("accion");

        try {
            if (accion == null) {
                throw new IllegalArgumentException("No se recibió la acción solicitada.");
            }

            switch (accion) {
                case "guardar": {
                    boolean guardado = registroMortalidadDAO.guardarRegistro(
                            construirRegistro(request));
                    guardarMensaje(request,
                            guardado ? "Registro guardado correctamente." : "No fue posible guardar el registro. Verifique la conexión y los datos.",
                            guardado ? "exito" : "error");
                    break;
                }
                case "actualizar": {
                    RegistroMortalidad registro = construirRegistro(request);
                    registro.setIdRegistro(leerEnteroPositivo(
                            request.getParameter("idRegistro"), "identificador"));
                    boolean actualizado = registroMortalidadDAO.actualizarRegistro(registro);
                    guardarMensaje(request,
                            actualizado ? "Registro actualizado correctamente." : "No fue posible actualizar el registro.",
                            actualizado ? "exito" : "error");
                    break;
                }
                case "eliminar": {
                    int idRegistro = leerEnteroPositivo(
                            request.getParameter("idRegistro"), "identificador");
                    boolean eliminado = registroMortalidadDAO.eliminarRegistro(idRegistro);
                    guardarMensaje(request,
                            eliminado ? "Registro eliminado correctamente." : "No fue posible eliminar el registro.",
                            eliminado ? "exito" : "error");
                    break;
                }
                default:
                    throw new IllegalArgumentException("La acción solicitada no es válida.");
            }
        } catch (IllegalArgumentException | DateTimeParseException error) {
            guardarMensaje(request, error.getMessage(), "error");
        } catch (Exception error) {
            getServletContext().log("Error al procesar el módulo de mortalidad.", error);
            guardarMensaje(request,
                    "Ocurrió un error al procesar la solicitud. Revise la configuración y los registros del servidor.",
                    "error");
        }

        if (esSolicitudJSON(request)) {
    Object mensaje = request.getSession().getAttribute("mensaje");
    Object tipoMensaje = request.getSession().getAttribute("tipoMensaje");

    String texto = mensaje == null
            ? "Solicitud procesada."
            : mensaje.toString();

    boolean exito = "exito".equals(tipoMensaje);

    request.getSession().removeAttribute("mensaje");
    request.getSession().removeAttribute("tipoMensaje");

    String json = "{"
            + "\"exito\":" + exito + ","
            + "\"mensaje\":\"" + escaparJSON(texto) + "\""
            + "}";

    responderJSON(response, exito ? 200 : 400, json);
    return;
}

response.sendRedirect(request.getContextPath() + "/registro-mortalidad");
    }

    /** Construye el modelo y valida los datos recibidos del formulario. */
    private RegistroMortalidad construirRegistro(HttpServletRequest request) {
    String fechaTexto = valorObligatorio(
            request.getParameter("fecha"), "fecha");

    LocalDate fecha;

    try {
        fecha = LocalDate.parse(fechaTexto);
    } catch (DateTimeParseException error) {
        throw new IllegalArgumentException(
                "La fecha debe tener un formato válido (AAAA-MM-DD).");
    }

    // La fecha no puede ser futura.
    if (fecha.isAfter(LocalDate.now())) {
        throw new IllegalArgumentException(
                "La fecha del registro no puede ser futura.");
    }

    int galpon = leerEnteroPositivo(
            request.getParameter("galpon"), "galpón");

    int cantidad = leerEnteroPositivo(
            request.getParameter("cantidad"), "cantidad");

    // Validar el rango de galpones de la granja.
    if (galpon < 1 || galpon > 8) {
        throw new IllegalArgumentException(
                "El galpón debe estar entre 1 y 8.");
    }

    if (cantidad < 1) {
        throw new IllegalArgumentException(
                "La cantidad de aves muertas debe ser mayor que cero.");
    }

    String causaProbable = valorObligatorio(
            request.getParameter("causaProbable"), "causa probable");

    String observaciones = limpiarTexto(
            request.getParameter("observaciones"));

    // Limitar la longitud de las observaciones.
    if (observaciones.length() > 250) {
        throw new IllegalArgumentException(
                "Las observaciones no pueden superar los 250 caracteres.");
    }

    RegistroMortalidad registro = new RegistroMortalidad();

    registro.setFecha(fecha);
    registro.setGalpon(galpon);
    registro.setCantidad(cantidad);
    registro.setCausaProbable(causaProbable);
    registro.setObservaciones(observaciones);

    return registro;
}

    private int leerEnteroPositivo(String texto, String campo) {
        String valor = valorObligatorio(texto, campo);
        try {
            int numero = Integer.parseInt(valor);
            if (numero <= 0) {
                throw new IllegalArgumentException("El campo " + campo + " debe ser mayor que cero.");
            }
            return numero;
        } catch (NumberFormatException error) {
            throw new IllegalArgumentException("El campo " + campo + " debe ser un número entero válido.");
        }
    }

    private String valorObligatorio(String valor, String campo) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new IllegalArgumentException("El campo " + campo + " es obligatorio.");
        }
        return valor.trim();
    }

    private String limpiarTexto(String texto) {
        return texto == null ? "" : texto.trim();
    }

    private void guardarMensaje(HttpServletRequest request, String mensaje, String tipo) {
        request.getSession().setAttribute("mensaje", mensaje);
        request.getSession().setAttribute("tipoMensaje", tipo);
    }

    private void cargarRegistros(HttpServletRequest request,
                                 HttpServletResponse response)
            throws ServletException, IOException {
        List<RegistroMortalidad> registros = registroMortalidadDAO.consultarRegistros();
        request.setAttribute("registros", registros);

        Object mensaje = request.getSession().getAttribute("mensaje");
        Object tipoMensaje = request.getSession().getAttribute("tipoMensaje");
        if (mensaje != null) {
            request.setAttribute("mensaje", mensaje);
            request.setAttribute("tipoMensaje", tipoMensaje);
            request.getSession().removeAttribute("mensaje");
            request.getSession().removeAttribute("tipoMensaje");
        }

        request.getRequestDispatcher("/registroMortalidad.jsp").forward(request, response);
    }
}
