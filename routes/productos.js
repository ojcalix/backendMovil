const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener productos por subcategoría
router.get('/:subcategory_id', (req, res) => {
    const { subcategory_id } = req.params;
    const sql = 'SELECT * FROM productos WHERE status = "active" AND subcategory_id = ?';
    
    db.query(sql, [subcategory_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;
