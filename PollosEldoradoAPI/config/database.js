const mongoose = require('mongoose');

// Establece la conexión con MongoDB.
const conectarBD = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log('Conexión con MongoDB exitosa.');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = conectarBD;