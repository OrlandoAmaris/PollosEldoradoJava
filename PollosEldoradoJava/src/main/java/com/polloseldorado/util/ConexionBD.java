package com.polloseldorado.util;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/** Administra la conexión JDBC sin escribir credenciales en el código fuente. */
public final class ConexionBD {

    private ConexionBD() {
        // Evita crear instancias de esta clase de utilidades.
    }

    public static Connection obtenerConexion() throws SQLException {
        Properties propiedades = cargarPropiedades();
        String url = obtenerConfiguracion("DB_URL", "db.url", propiedades);
        String usuario = obtenerConfiguracion("DB_USUARIO", "db.usuario", propiedades);
        String contrasena = obtenerConfiguracion("DB_CONTRASENA", "db.contrasena", propiedades);

        if (vacio(url) || vacio(usuario) || contrasena == null) {
            throw new SQLException("Falta configurar DB_URL, DB_USUARIO y DB_CONTRASENA "
                    + "como variables de entorno o en el archivo local db.properties.");
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException error) {
            throw new SQLException("No se encontró el controlador JDBC de MySQL.", error);
        }

        return DriverManager.getConnection(url, usuario, contrasena);
    }

    private static Properties cargarPropiedades() throws SQLException {
        Properties propiedades = new Properties();
        try (InputStream entrada = ConexionBD.class.getResourceAsStream("/db.properties")) {
            if (entrada != null) {
                propiedades.load(entrada);
            }
        } catch (IOException error) {
            throw new SQLException("No fue posible leer el archivo local db.properties.", error);
        }
        return propiedades;
    }

    private static String obtenerConfiguracion(String variableEntorno,
                                               String propiedad,
                                               Properties propiedades) {
        String valor = System.getenv(variableEntorno);
        if (valor == null || valor.trim().isEmpty()) {
            valor = propiedades.getProperty(propiedad);
        }
        return valor == null ? null : valor.trim();
    }

    private static boolean vacio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}
