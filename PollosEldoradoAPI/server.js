require('dotenv').config();

const express = require('express');
const conectarBD = require('./config/database');
const rutasAuth = require('./routes/auth');

const app = express();

// Permite recibir información en formato JSON.
app.use(express.json());

// Conecta las rutas de autenticación.
app.use('/api/auth', rutasAuth);

// Inicia el servidor después de conectar la base de datos.
const iniciarServidor = async () => {
    await conectarBD();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`API disponible en http://localhost:${PORT}`);
    });
};

iniciarServidor();