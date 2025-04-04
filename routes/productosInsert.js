const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Middleware para servir imágenes subidas
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Asegurarnos de que la carpeta 'uploads' exista
const uploadDirectory = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Configuración de multer para almacenamiento en disco
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueName = `product_${Date.now()}.jpg`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

router.post('/', upload.single('productImage'), async (req, res) => {
    try {
        const {
            productId, productName, productBrand, productCategory,
            productSubCategory, productDescription, productSupplier,
            purchasePrice, salePrice, productQuantity
        } = req.body;

        let imagePath = null;

        if (req.file) {
            const filePath = req.file.path;
            const optimizedImagePath = path.join(uploadDirectory, `optimized_${req.file.filename}`);

            // Optimizar imagen
            await sharp(filePath)
                .resize(500, 500)
                .toFormat('jpeg', { quality: 80 })
                .toFile(optimizedImagePath);

            fs.unlinkSync(filePath); // Eliminar original

            // URL absoluta con protocolo y host dinámico
            const serverUrl = `${req.protocol}://${req.get('host')}`;
            imagePath = `${serverUrl}/uploads/${path.basename(optimizedImagePath)}`;
        }

        const sql = `
            INSERT INTO productos 
            (id, name, brand, description, supplier_id, category_id, subcategory_id, purchase_price, sale_price, quantity, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        db.query(sql, [
            productId, productName, productBrand, productDescription, productSupplier,
            productCategory, productSubCategory, purchasePrice, salePrice, productQuantity, imagePath
        ], (err) => {
            if (err) {
                console.error('Error al agregar el producto:', err);
                return res.status(500).send('Error al agregar el producto');
            }
            res.send('Producto agregado correctamente');
        });

    } catch (error) {
        console.error('Error procesando la imagen:', error);
        res.status(500).send('Error procesando la imagen');
    }
});

module.exports = router;
