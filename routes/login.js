const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Primero intenta iniciar sesión como cliente
    const clienteQuery = "SELECT * FROM clientes WHERE email = ?";
    db.query(clienteQuery, [email], async (err, clienteResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error en el servidor" });
        }

        if (clienteResults.length > 0) {
            const user = clienteResults[0];
            try {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({ error: "Contraseña incorrecta" });
                }

                const token = jwt.sign({ id: user.id, first_name: user.first_name }, "secret_key", { expiresIn: '1h' });
                return res.json({
                    message: "Inicio de sesión exitoso",
                    token,
                    user: {
                        first_name: user.first_name,
                        email: user.email,
                        isAdmin: false
                    }
                });
            } catch (error) {
                console.error("Error al comparar contraseñas:", error);
                return res.status(500).json({ error: "Error al verificar la contraseña" });
            }
        } else {
            // Si no es cliente, intenta verificar en la tabla usuarios (administradores)
            const adminQuery = "SELECT * FROM usuarios WHERE email = ?";
            db.query(adminQuery, [email], async (adminErr, adminResults) => {
                if (adminErr) {
                    console.error(adminErr);
                    return res.status(500).json({ error: "Error en el servidor" });
                }

                if (adminResults.length === 0) {
                    return res.status(401).json({ error: "Usuario no encontrado" });
                }

                const adminUser = adminResults[0];
                try {
                    const passwordMatch = await bcrypt.compare(password, adminUser.password);
                    if (!passwordMatch) {
                        return res.status(401).json({ error: "Contraseña incorrecta" });
                    }

                    const token = jwt.sign({ id: adminUser.id, username: adminUser.username }, "secret_key", { expiresIn: '1h' });
                    return res.json({
                        message: "Inicio de sesión exitoso (Admin)",
                        token,
                        user: {
                            first_name: adminUser.username,
                            email: adminUser.email,
                            isAdmin: adminUser.role === 'Administrador'
                        }
                    });
                } catch (error) {
                    console.error("Error al comparar contraseñas:", error);
                    return res.status(500).json({ error: "Error al verificar la contraseña" });
                }
            });
        }
    });
});

module.exports = router;
