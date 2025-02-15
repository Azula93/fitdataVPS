const mysql = require('mysql2');

// Configuración de la conexión
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Azula93!$%',
    database: process.env.DB_DATABASE || 'fitdataDB',
});

// Probar la conexión
(async () => {
  try {
    const connection = pool.promise();
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('Conexión exitosa, resultado:', rows[0].solution); // Debería imprimir "2"
  } catch (error) {
    console.error('Error conectando a la base de datos:', error.message);
  } finally {
    pool.end(); // Cierra la conexión
  }
})();

