
require('dotenv').config();

const express = require('express');
const conectarBD = require('./config/database');

// Servicios web del proyecto Pollos ElDorado.
const rutasAuth = require('./routes/auth');
const rutasMortalidad = require('./routes/mortalidad');
const rutasGalpones = require('./routes/galpones');
const rutasReportes = require('./routes/reportes');

const app = express();

// Permite recibir información en formato JSON.
app.use(express.json());

// Servicios de usuarios y autenticación.
app.use('/api/auth', rutasAuth);

// Servicios de gestión de mortalidad.
app.use('/api/mortalidad', rutasMortalidad);

// Servicios de consulta de galpones.
app.use('/api/galpones', rutasGalpones);

// Servicios de reportes de mortalidad.
app.use('/api/reportes', rutasReportes);

// Inicia el servidor después de conectar MongoDB.
const iniciarServidor = async () => {
    await conectarBD();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`API disponible en http://localhost:${PORT}`);
    });
};

iniciarServidor();
