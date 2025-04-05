const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'ojcalix.mysql.database.azure.com',
    user: 'ojcalix',
    password: 'Shekelo2025',
    database: 'vansue',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Verificar conexión (opcional)
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión a la base de datos MySQL (pool)');
        connection.release(); // importante liberar la conexión de prueba
    }
});

module.exports = db;
