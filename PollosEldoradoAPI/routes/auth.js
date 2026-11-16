const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const router = express.Router();

// SERVICIO 1: REGISTRO DE USUARIO
router.post('/registro', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Valida que los campos estén completos.
        if (!username || !password) {
            return res.status(400).json({
                mensaje: 'El usuario y la contraseña son obligatorios.'
            });
        }

        // Valida la longitud mínima de la contraseña.
        if (password.length < 6) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener mínimo 6 caracteres.'
            });
        }

        const nombreUsuario = username.trim().toLowerCase();

        if (!nombreUsuario) {
            return res.status(400).json({
                mensaje: 'El nombre de usuario no es válido.'
            });
        }

        // Comprueba si el usuario ya está registrado.
        const usuarioExiste = await Usuario.findOne({
            username: nombreUsuario
        });

        if (usuarioExiste) {
            return res.status(409).json({
                mensaje: 'El usuario ya está registrado.'
            });
        }

        // Cifra la contraseña antes de guardarla.
        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            username: nombreUsuario,
            passwordHash
        });

        await nuevoUsuario.save();

        return res.status(201).json({
            mensaje: 'Usuario registrado correctamente.'
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: 'El usuario ya está registrado.'
            });
        }

        return res.status(500).json({
            mensaje: 'Error al registrar el usuario.'
        });
    }
});

// SERVICIO 2: INICIO DE SESIÓN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Valida que se reciban las credenciales.
        if (!username || !password) {
            return res.status(400).json({
                mensaje: 'El usuario y la contraseña son obligatorios.'
            });
        }

        // Busca el usuario y permite consultar su contraseña cifrada.
        const usuario = await Usuario.findOne({
            username: username.trim().toLowerCase()
        }).select('+passwordHash');

        // Comprueba que el usuario exista.
        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        // Compara la contraseña recibida con la almacenada.
        const contrasenaCorrecta = await bcrypt.compare(
            password,
            usuario.passwordHash
        );

        if (!contrasenaCorrecta) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        return res.status(200).json({
            mensaje: 'Autenticación satisfactoria.',
            usuario: usuario.username
        });

    } catch (error) {
        return res.status(500).json({
            mensaje: 'Error al realizar la autenticación.'
        });
    }
});

module.exports = router;