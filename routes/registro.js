const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Conexión a la BD
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
    const { first_name, last_name, email, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = "INSERT INTO clientes (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [first_name, last_name, email, phone, hashedPassword], (err, result) => {
            if (err) {
                console.error("Error al agregar cliente:", err);
                return res.status(500).json({ error: "Error al agregar cliente" });
            }
            res.status(201).json({ message: "Cliente agregado correctamente", clienteId: result.insertId });
        });
    } catch (error) {
        console.error("Error en la encriptación de la contraseña:", error);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

module.exports = router;
