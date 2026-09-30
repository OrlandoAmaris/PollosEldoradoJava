package com.polloseldorado.controlador;

import com.polloseldorado.util.ConexionBD;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/prueba-conexion")
public class PruebaConexionServlet extends HttpServlet {

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        try (Connection conexion = ConexionBD.obtenerConexion()) {

            DatabaseMetaData datosBD =
                    conexion.getMetaData();

            try (PrintWriter salida = response.getWriter()) {

                salida.println("<!DOCTYPE html>");
                salida.println("<html lang='es'>");
                salida.println("<head>");
                salida.println("<meta charset='UTF-8'>");
                salida.println("<title>Prueba JDBC</title>");
                salida.println("</head>");
                salida.println("<body>");

                salida.println("<h1>POLLOS ELDORADO</h1>");
                salida.println("<h2>Prueba de conexión JDBC</h2>");

                salida.println(
                        "<p>Conexión realizada correctamente.</p>");

                salida.println(
                        "<p>SGBD: "
                        + datosBD.getDatabaseProductName()
                        + "</p>");

                salida.println(
                        "<p>Versión: "
                        + datosBD.getDatabaseProductVersion()
                        + "</p>");

                salida.println("</body>");
                salida.println("</html>");
            }

        } catch (SQLException error) {

            response.setContentType("text/html;charset=UTF-8");

            response.getWriter().println(
                    "<h2>Error de conexión JDBC</h2>"
                    + "<p>"
                    + error.getMessage()
                    + "</p>"
            );
        }
    }
}