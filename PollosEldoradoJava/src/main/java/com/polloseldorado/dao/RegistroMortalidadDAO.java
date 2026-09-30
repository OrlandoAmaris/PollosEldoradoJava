package com.polloseldorado.dao;

import com.polloseldorado.modelo.RegistroMortalidad;
import com.polloseldorado.util.ConexionBD;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class RegistroMortalidadDAO {

    public boolean guardarRegistro(RegistroMortalidad registro) {

    String sql = "INSERT INTO registro_mortalidad "
            + "(fecha, galpon, cantidad, causa_probable, observaciones) "
            + "VALUES (?, ?, ?, ?, ?)";

    try (Connection conexion = ConexionBD.obtenerConexion();
         PreparedStatement sentencia =
                 conexion.prepareStatement(sql)) {

        sentencia.setDate(
                1,
                Date.valueOf(registro.getFecha()));

        sentencia.setInt(
                2,
                registro.getGalpon());

        sentencia.setInt(
                3,
                registro.getCantidad());

        sentencia.setString(
                4,
                registro.getCausaProbable());

        sentencia.setString(
                5,
                registro.getObservaciones());

        int filasAfectadas = sentencia.executeUpdate();

        System.out.println(
                "Filas insertadas: " + filasAfectadas);

        return filasAfectadas > 0;

    } catch (Exception error) {

        System.err.println(
                "ERROR AL GUARDAR REGISTRO DE MORTALIDAD:");

        error.printStackTrace();

        return false;
    }
}

    public List<RegistroMortalidad> consultarRegistros() {

        List<RegistroMortalidad> registros =
                new ArrayList<>();

        String sql = "SELECT * FROM registro_mortalidad "
                + "ORDER BY fecha DESC";

        try (Connection conexion =
                     ConexionBD.obtenerConexion();
             PreparedStatement sentencia =
                     conexion.prepareStatement(sql);
             ResultSet resultado =
                     sentencia.executeQuery()) {

            while (resultado.next()) {

                RegistroMortalidad registro =
                        new RegistroMortalidad();

                registro.setIdRegistro(
                        resultado.getInt("id_registro"));

                registro.setFecha(
                        resultado.getDate("fecha").toLocalDate());

                registro.setGalpon(
                        resultado.getInt("galpon"));

                registro.setCantidad(
                        resultado.getInt("cantidad"));

                registro.setCausaProbable(
                        resultado.getString("causa_probable"));

                registro.setObservaciones(
                        resultado.getString("observaciones"));

                registros.add(registro);
            }

        } catch (Exception error) {
            error.printStackTrace();
        }

        return registros;
    }

    public RegistroMortalidad obtenerPorId(int idRegistro) {

        String sql = "SELECT * FROM registro_mortalidad "
                + "WHERE id_registro = ?";

        try (Connection conexion =
                     ConexionBD.obtenerConexion();
             PreparedStatement sentencia =
                     conexion.prepareStatement(sql)) {

            sentencia.setInt(1, idRegistro);

            try (ResultSet resultado =
                         sentencia.executeQuery()) {

                if (resultado.next()) {

                    RegistroMortalidad registro =
                            new RegistroMortalidad();

                    registro.setIdRegistro(
                            resultado.getInt("id_registro"));

                    registro.setFecha(
                            resultado.getDate(
                                    "fecha").toLocalDate());

                    registro.setGalpon(
                            resultado.getInt("galpon"));

                    registro.setCantidad(
                            resultado.getInt("cantidad"));

                    registro.setCausaProbable(
                            resultado.getString(
                                    "causa_probable"));

                    registro.setObservaciones(
                            resultado.getString(
                                    "observaciones"));

                    return registro;
                }
            }

        } catch (Exception error) {
            error.printStackTrace();
        }

        return null;
    }

    public boolean actualizarRegistro(
            RegistroMortalidad registro) {

        String sql = "UPDATE registro_mortalidad SET "
                + "fecha = ?, galpon = ?, cantidad = ?, "
                + "causa_probable = ?, observaciones = ? "
                + "WHERE id_registro = ?";

        try (Connection conexion =
                     ConexionBD.obtenerConexion();
             PreparedStatement sentencia =
                     conexion.prepareStatement(sql)) {

            sentencia.setDate(
                    1,
                    Date.valueOf(registro.getFecha()));

            sentencia.setInt(
                    2,
                    registro.getGalpon());

            sentencia.setInt(
                    3,
                    registro.getCantidad());

            sentencia.setString(
                    4,
                    registro.getCausaProbable());

            sentencia.setString(
                    5,
                    registro.getObservaciones());

            sentencia.setInt(
                    6,
                    registro.getIdRegistro());

            return sentencia.executeUpdate() > 0;

        } catch (Exception error) {
            error.printStackTrace();
            return false;
        }
    }

    public boolean eliminarRegistro(int idRegistro) {

        String sql = "DELETE FROM registro_mortalidad "
                + "WHERE id_registro = ?";

        try (Connection conexion =
                     ConexionBD.obtenerConexion();
             PreparedStatement sentencia =
                     conexion.prepareStatement(sql)) {

            sentencia.setInt(1, idRegistro);

            return sentencia.executeUpdate() > 0;

        } catch (Exception error) {
            error.printStackTrace();
            return false;
        }
    }
}