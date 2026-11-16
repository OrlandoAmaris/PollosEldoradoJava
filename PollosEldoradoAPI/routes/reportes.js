
const express = require('express');
const Mortalidad = require('../models/Mortalidad');

const router = express.Router();

// Valida que una fecha exista y tenga formato AAAA-MM-DD.
function fechaValida(fecha) {
    if (typeof fecha !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const valor = new Date(`${fecha}T00:00:00Z`);

    return !Number.isNaN(valor.getTime()) &&
        valor.toISOString().slice(0, 10) === fecha;
}

// SERVICIO: REPORTE DE MORTALIDAD ACUMULADA
// Permite consultar por galpón, lote y rango de fechas.
router.get('/mortalidad', async (req, res) => {
    try {
        const { galpon, lote, fechaDesde, fechaHasta } = req.query;

        const filtro = {};

        // Filtra por uno de los ocho galpones.
        if (galpon !== undefined) {
            const numero = Number(galpon);

            if (!Number.isInteger(numero) ||
                numero < 1 || numero > 8) {
                return res.status(400).json({
                    mensaje: 'El galpón debe estar entre 1 y 8.'
                });
            }

            filtro.galpon = numero;
        }

        // Filtra por lote de producción.
        if (lote !== undefined) {
            if (typeof lote !== 'string' || !lote.trim()) {
                return res.status(400).json({
                    mensaje: 'El lote no es válido.'
                });
            }

            filtro.lote = lote.trim();
        }

        // Valida las fechas antes de realizar la consulta.
        if (fechaDesde !== undefined && !fechaValida(fechaDesde)) {
            return res.status(400).json({
                mensaje: 'La fecha inicial no es válida.'
            });
        }

        if (fechaHasta !== undefined && !fechaValida(fechaHasta)) {
            return res.status(400).json({
                mensaje: 'La fecha final no es válida.'
            });
        }

        if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
            return res.status(400).json({
                mensaje: 'La fecha inicial no puede superar la final.'
            });
        }

        // Aplica los filtros de fecha cuando se reciben.
        if (fechaDesde || fechaHasta) {
            filtro.fecha = {};

            if (fechaDesde) {
                filtro.fecha.$gte = fechaDesde;
            }

            if (fechaHasta) {
                filtro.fecha.$lte = fechaHasta;
            }
        }

        // Consulta los registros almacenados en MongoDB.
        const registros = await Mortalidad.find(filtro)
            .sort({ fecha: 1, galpon: 1, lote: 1 });

        // Calcula los totales de los registros consultados.
        const totalMuertas = registros.reduce(
            (total, registro) => total + registro.muertas, 0
        );

        const totalEnfermasReportadas = registros.reduce(
            (total, registro) => total + registro.enfermas, 0
        );

        // Agrupa los resultados por galpón y lote.
        const agrupados = new Map();

        for (const registro of registros) {
            const clave = `${registro.galpon}|${registro.lote}`;

            if (!agrupados.has(clave)) {
                agrupados.set(clave, {
                    galpon: registro.galpon,
                    lote: registro.lote,
                    totalMuertas: 0,
                    totalEnfermasReportadas: 0,
                    cantidadRegistros: 0
                });
            }

            const grupo = agrupados.get(clave);

            grupo.totalMuertas += registro.muertas;
            grupo.totalEnfermasReportadas += registro.enfermas;
            grupo.cantidadRegistros += 1;
        }

        return res.status(200).json({
            mensaje: 'Reporte de mortalidad generado correctamente.',
            filtros: {
                galpon: galpon ?? null,
                lote: lote ?? null,
                fechaDesde: fechaDesde ?? null,
                fechaHasta: fechaHasta ?? null
            },
            resumen: {
                cantidadRegistros: registros.length,
                totalMuertas,
                totalEnfermasReportadas
            },
            porGalponYLote: Array.from(agrupados.values())
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al generar el reporte de mortalidad.'
        });
    }
});

module.exports = router;
