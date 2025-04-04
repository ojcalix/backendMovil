const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'ojcalix.mysql.database.azure.com', // Dirección del servidor de la base de datos (local en este caso)
    user: 'ojcalix', // Usuario de MySQL (debe ser tu usuario configurado)
    password: 'Shekelo2025', // Contraseña para el usuario de MySQL
    database: 'vansue', // Nombre de la base de datos donde se almacenarán los datos
});

db.connect((err) => {
    if(err){
        console.error('Error al conectar a la base de datos:', err);
    }else{
        console.log('Conexion a la base de datos MySQL');
    }
});
module.exports = db;