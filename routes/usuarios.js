const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Conexión a la BD

// 🔹 Ruta para obtener todos los usuarios
router.get("/", (req, res) => {
    const query = "SELECT id, username, email, status FROM usuarios";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener los usuarios:", err);
            return res.status(500).send("Error al obtener los usuarios.");
        }
        res.json(results);
    });
});

// 🔹 Ruta para actualizar el estado de un usuario (Activo/Inactivo)
router.put("/actualizarEstado/:id", (req, res) => {
    const userId = req.params.id;
    const newStatus = req.body.status; // 'Activo' o 'Inactivo'

    const query = `UPDATE usuarios SET status = ? WHERE id = ?`;

    db.query(query, [newStatus, userId], (err, result) => {
        if (err) {
            console.error("Error al actualizar el estado del usuario:", err);
            return res.status(500).send("Error al actualizar el estado del usuario.");
        }
        res.send("Estado actualizado correctamente.");
    });
});

module.exports = router;
