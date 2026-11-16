
const express = require('express');
const mongoose = require('mongoose');
const Mortalidad = require('../models/Mortalidad');

const router = express.Router();

// Valida los datos recibidos para registrar o actualizar mortalidad.
function validarDatos(datos) {
    const { fecha, galpon, lote, muertas, enfermas = 0 } = datos;

    // Comprueba que los campos obligatorios estén completos.
    if (
        typeof fecha !== 'string' ||
        !Number.isInteger(galpon) ||
        typeof lote !== 'string' ||
        !lote.trim() ||
        !Number.isInteger(muertas) ||
        !Number.isInteger(enfermas)
    ) {
        return 'Los datos de mortalidad son incompletos o inválidos.';
    }

    // Verifica que la fecha exista realmente.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return 'La fecha debe tener el formato AAAA-MM-DD.';
    }

    const fechaReal = new Date(`${fecha}T00:00:00Z`);

    if (
        Number.isNaN(fechaReal.getTime()) ||
        fechaReal.toISOString().slice(0, 10) !== fecha
    ) {
        return 'La fecha ingresada no es válida.';
    }

    // La granja cuenta con ocho galpones.
    if (galpon < 1 || galpon > 8) {
        return 'El galpón debe estar entre 1 y 8.';
    }

    if (muertas < 0 || enfermas < 0) {
        return 'Las cantidades no pueden ser negativas.';
    }

    if (
        datos.observacion !== undefined &&
        typeof datos.observacion !== 'string'
    ) {
        return 'La observación debe ser un texto.';
    }

    return null;
}

// SERVICIO 1: REGISTRAR MORTALIDAD
router.post('/', async (req, res) => {
    try {
        const error = validarDatos(req.body);

        if (error) {
            return res.status(400).json({ mensaje: error });
        }

        const registro = await Mortalidad.create(req.body);

        return res.status(201).json({
            mensaje: 'Registro de mortalidad guardado correctamente.',
            registro
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al registrar la mortalidad.'
        });
    }
});

// SERVICIO 2: CONSULTAR REGISTROS
router.get('/', async (req, res) => {
    try {
        const filtro = {};

        // Permite filtrar registros por galpón y lote.
        if (req.query.galpon !== undefined) {
            const galpon = Number(req.query.galpon);

            if (!Number.isInteger(galpon) || galpon < 1 || galpon > 8) {
                return res.status(400).json({
                    mensaje: 'El galpón debe estar entre 1 y 8.'
                });
            }

            filtro.galpon = galpon;
        }

        if (req.query.lote !== undefined) {
            if (
                typeof req.query.lote !== 'string' ||
                !req.query.lote.trim()
            ) {
                return res.status(400).json({
                    mensaje: 'El lote no es válido.'
                });
            }

            filtro.lote = req.query.lote.trim();
        }

        const registros = await Mortalidad.find(filtro)
            .sort({ fecha: -1 });

        return res.status(200).json(registros);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al consultar los registros.'
        });
    }
});

// SERVICIO 3: ACTUALIZAR REGISTRO
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                mensaje: 'El identificador no es válido.'
            });
        }

        const error = validarDatos(req.body);

        if (error) {
            return res.status(400).json({ mensaje: error });
        }

        const registro = await Mortalidad.findByIdAndUpdate(
            req.params.id,
            {
                fecha: req.body.fecha,
                galpon: req.body.galpon,
                lote: req.body.lote,
                muertas: req.body.muertas,
                enfermas: req.body.enfermas ?? 0,
                observacion: req.body.observacion ?? ''
            },
            { new: true, runValidators: true }
        );

        if (!registro) {
            return res.status(404).json({
                mensaje: 'Registro de mortalidad no encontrado.'
            });
        }

        return res.status(200).json({
            mensaje: 'Registro actualizado correctamente.',
            registro
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al actualizar el registro.'
        });
    }
});

// SERVICIO 4: ELIMINAR REGISTRO
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                mensaje: 'El identificador no es válido.'
            });
        }

        const registro = await Mortalidad.findByIdAndDelete(
            req.params.id
        );

        if (!registro) {
            return res.status(404).json({
                mensaje: 'Registro de mortalidad no encontrado.'
            });
        }

        return res.status(200).json({
            mensaje: 'Registro eliminado correctamente.'
        });
    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al eliminar el registro.'
        });
    }
});

module.exports = router;
