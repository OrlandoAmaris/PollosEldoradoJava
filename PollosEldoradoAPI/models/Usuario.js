const mongoose = require('mongoose');

// Define la estructura de los usuarios registrados.
const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);