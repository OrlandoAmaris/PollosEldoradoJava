
const express = require('express');

const router = express.Router();

// Información de los ocho galpones de Pollos ElDorado.
// Por ahora, se utiliza un catálogo fijo de galpones.
const galpones = Array.from({ length: 8 }, (_, indice) => ({
    numero: indice + 1,
    nombre: `Galpón ${indice + 1}`
}));

// SERVICIO 1: CONSULTAR TODOS LOS GALPONES
router.get('/', (req, res) => {
    return res.status(200).json({
        mensaje: 'Consulta de galpones satisfactoria.',
        total: galpones.length,
        galpones
    });
});

// SERVICIO 2: CONSULTAR UN GALPÓN POR NÚMERO
router.get('/:numero', (req, res) => {
    const numero = Number(req.params.numero);

    // Verifica que el número sea un entero entre 1 y 8.
    if (!Number.isInteger(numero) || numero < 1 || numero > 8) {
        return res.status(400).json({
            mensaje: 'El número de galpón debe estar entre 1 y 8.'
        });
    }

    const galpon = galpones.find(
        elemento => elemento.numero === numero
    );

    return res.status(200).json({
        mensaje: 'Galpón consultado correctamente.',
        galpon
    });
});

module.exports = router;
