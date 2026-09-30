package com.polloseldorado.modelo;

import java.time.LocalDate;

public class RegistroMortalidad {

    private int idRegistro;
    private LocalDate fecha;
    private int galpon;
    private int cantidad;
    private String causaProbable;
    private String observaciones;

    public RegistroMortalidad() {
    }

    public RegistroMortalidad(
            int idRegistro,
            LocalDate fecha,
            int galpon,
            int cantidad,
            String causaProbable,
            String observaciones) {

        this.idRegistro = idRegistro;
        this.fecha = fecha;
        this.galpon = galpon;
        this.cantidad = cantidad;
        this.causaProbable = causaProbable;
        this.observaciones = observaciones;
    }

    public int getIdRegistro() {
        return idRegistro;
    }

    public void setIdRegistro(int idRegistro) {
        this.idRegistro = idRegistro;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public int getGalpon() {
        return galpon;
    }

    public void setGalpon(int galpon) {
        this.galpon = galpon;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public String getCausaProbable() {
        return causaProbable;
    }

    public void setCausaProbable(String causaProbable) {
        this.causaProbable = causaProbable;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
