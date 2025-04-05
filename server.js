const express = require('express');
const cors = require('cors');
const path = require('path'); // Asegúrate de importar 'path'

const db = require('./config/db');
const app = express();
const PORT = 3002;

app.use(express.json()); // Permite que Express entienda JSON

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const registroRoutes = require('./routes/registro');
app.use('/registro', registroRoutes);

const productosRoutes = require('./routes/productos');
app.use('/productos', productosRoutes);

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

const productosInsertRoutes = require('./routes/productosInsert');
app.use('/productosInsert', productosInsertRoutes);

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes); 

const ventasRoutes = require('./routes/ventas');
app.use('/ventas', ventasRoutes);

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
