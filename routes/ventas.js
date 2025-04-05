const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Insertar venta
router.post('/', async (req, res) => {
    const { customer_id, total, earned_points, productos } = req.body;

    const conn = await db.promise().getConnection();
    await conn.beginTransaction();

    try {
        // Insertar venta
        const [ventaResult] = await conn.query(
            'INSERT INTO ventas (customer_id, total, earned_points) VALUES (?, ?, ?)',
            [customer_id, total, earned_points]
        );
        const ventaId = ventaResult.insertId;

        // Insertar detalle de cada producto
        for (const producto of productos) {
            const productoPuntos = Math.floor(producto.subtotal / 40);
            await conn.query(
                'INSERT INTO ventas_detalle (sale_id, product_id, quantity, subtotal, earned_points) VALUES (?, ?, ?, ?, ?)',
                [ventaId, producto.product_id, producto.quantity, producto.subtotal, productoPuntos]
            );
        }

        // Insertar en historial_puntos
        await conn.query(
            'INSERT INTO historial_puntos (customer_id, sale_id, points, type) VALUES (?, ?, ?, "earned")',
            [customer_id, ventaId, earned_points]
        );

        // Actualizar puntos en clientes
        await conn.query(
            'UPDATE clientes SET accumulated_points = accumulated_points + ? WHERE id = ?',
            [earned_points, customer_id]
        );

        await conn.commit();
        conn.release();

        res.json({ success: true, ventaId });

    } catch (error) {
        await conn.rollback();
        conn.release();
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
});

module.exports = router;
