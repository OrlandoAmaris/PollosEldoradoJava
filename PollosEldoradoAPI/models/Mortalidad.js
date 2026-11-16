
const mongoose = require('mongoose');

// Modelo de datos para los registros de mortalidad
// del proyecto App Pollos ElDorado.
const mortalidadSchema = new mongoose.Schema({
    fecha: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
    },
    galpon: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    lote: {
        type: String,
        required: true,
        trim: true
    },
    muertas: {
        type: Number,
        required: true,
        min: 0
    },
    enfermas: {
        type: Number,
        default: 0,
        min: 0
    },
    observacion: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

// Exporta el modelo para utilizarlo en los servicios web.
module.exports = mongoose.model('Mortalidad', mortalidadSchema);
