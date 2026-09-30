package com.polloseldorado.util;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class ConexionBD {

    private ConexionBD() {
    }

    public static Connection obtenerConexion()
            throws SQLException {

        Properties propiedades = cargarPropiedades();

        String url = propiedades.getProperty("db.url");
        String usuario = propiedades.getProperty("db.usuario");
        String contrasena =
                propiedades.getProperty("db.contrasena");

        if (url == null || usuario == null || contrasena == null) {
            throw new SQLException(
                    "Faltan propiedades de configuración de la base de datos."
            );
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException error) {
            throw new SQLException(
                    "No se encontró el controlador JDBC de MySQL.",
                    error
            );
        }

        return DriverManager.getConnection(
                url,
                usuario,
                contrasena
        );
    }

    private static Properties cargarPropiedades() {

        Properties propiedades = new Properties();

        try (InputStream entrada =
                     ConexionBD.class.getResourceAsStream(
                             "/db.properties")) {

            if (entrada == null) {
                throw new IllegalStateException(
                        "No se encontró el archivo db.properties "
                        + "en el classpath."
                );
            }

            propiedades.load(entrada);

            return propiedades;

        } catch (IOException error) {

            throw new IllegalStateException(
                    "No fue posible leer db.properties.",
                    error
            );
        }
    }
}