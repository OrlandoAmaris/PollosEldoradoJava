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

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String accion = request.getParameter("accion");

        if ("editar".equals(accion)) {

            int idRegistro = Integer.parseInt(
                    request.getParameter("idRegistro"));

            RegistroMortalidad registroEditar =
                    registroMortalidadDAO.obtenerPorId(idRegistro);

            request.setAttribute(
                    "registroEditar",
                    registroEditar);
        }

        cargarRegistros(request, response);
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String accion = request.getParameter("accion");

        if ("guardar".equals(accion)) {

            RegistroMortalidad registro =
                    construirRegistro(request);

            registroMortalidadDAO.guardarRegistro(registro);

        } else if ("actualizar".equals(accion)) {

            RegistroMortalidad registro =
                    construirRegistro(request);

            registro.setIdRegistro(
                    Integer.parseInt(
                            request.getParameter("idRegistro")));

            registroMortalidadDAO.actualizarRegistro(registro);

        } else if ("eliminar".equals(accion)) {

            int idRegistro = Integer.parseInt(
                    request.getParameter("idRegistro"));

            registroMortalidadDAO.eliminarRegistro(idRegistro);
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
                request.getParameter("causaProbable"));

        registro.setObservaciones(
                request.getParameter("observaciones"));

        return registro;
    }

    private void cargarRegistros(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        List<RegistroMortalidad> registros =
                registroMortalidadDAO.consultarRegistros();

        request.setAttribute("registros", registros);

        request.getRequestDispatcher(
                "/registroMortalidad.jsp")
                .forward(request, response);
    }
}