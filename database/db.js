const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

const pool = new Pool({
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 5432,
    connectionTimeoutMillis: 60000, // Aumenta el tiempo de espera a 60 segundos
});

// Verificar conectividad al iniciar
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conexión a la BD establecida');
    release();
});

// Capturar errores inesperados del pool sin crashear el servidor
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de BD:', err);
});

module.exports = pool;