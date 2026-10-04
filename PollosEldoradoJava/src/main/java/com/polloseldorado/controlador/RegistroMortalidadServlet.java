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
import java.util.List;

@WebServlet("/registro-mortalidad")
public class RegistroMortalidadServlet extends HttpServlet {

    private final RegistroMortalidadDAO registroMortalidadDAO =
            new RegistroMortalidadDAO();

    /**
     * Procesa solicitudes GET.
     * Se utiliza para consultar y editar registros.
     */
    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String accion = request.getParameter("accion");

        if ("editar".equals(accion)) {

            String parametroId =
                    request.getParameter("idRegistro");

            if (parametroId != null
                    && !parametroId.isEmpty()) {

                int idRegistro =
                        Integer.parseInt(parametroId);

                RegistroMortalidad registroEditar =
                        registroMortalidadDAO
                                .obtenerPorId(idRegistro);

                request.setAttribute(
                        "registroEditar",
                        registroEditar);
            }
        }

        cargarRegistros(request, response);
    }

    /**
     * Procesa solicitudes POST.
     * Se utiliza para guardar, actualizar y eliminar.
     */
    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        String accion =
                request.getParameter("accion");

        switch (accion) {

            case "guardar":

                RegistroMortalidad nuevoRegistro =
                        construirRegistro(request);

                registroMortalidadDAO
                        .guardarRegistro(nuevoRegistro);

                break;

            case "actualizar":

                RegistroMortalidad registroActualizado =
                        construirRegistro(request);

                registroActualizado.setIdRegistro(
                        Integer.parseInt(
                                request.getParameter(
                                        "idRegistro")));

                registroMortalidadDAO
                        .actualizarRegistro(
                                registroActualizado);

                break;

            case "eliminar":

                int idRegistro =
                        Integer.parseInt(
                                request.getParameter(
                                        "idRegistro"));

                registroMortalidadDAO
                        .eliminarRegistro(idRegistro);

                break;

            default:
                break;
        }

        response.sendRedirect(
                request.getContextPath()
                + "/registro-mortalidad");
    }

    private RegistroMortalidad construirRegistro(
            HttpServletRequest request) {

        RegistroMortalidad registro =
                new RegistroMortalidad();

        registro.setFecha(
                LocalDate.parse(
                        request.getParameter("fecha")));

        registro.setGalpon(
                Integer.parseInt(
                        request.getParameter("galpon")));

        registro.setCantidad(
                Integer.parseInt(
                        request.getParameter("cantidad")));

        registro.setCausaProbable(
                request.getParameter(
                        "causaProbable"));

        registro.setObservaciones(
                request.getParameter(
                        "observaciones"));

        return registro;
    }

    private void cargarRegistros(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        List<RegistroMortalidad> registros =
                registroMortalidadDAO
                        .consultarRegistros();

        request.setAttribute(
                "registros",
                registros);

        request.getRequestDispatcher(
                "/registroMortalidad.jsp")
                .forward(request, response);
    }
}