const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

const connectionConfig = {
    host: process.env.DB_HOST || '147.79.110.68',
    user: process.env.DB_USER || 'u748307513_hostingerSS',
    password: process.env.DB_PASSWORD || 'NuevaContraseñaSegura123!',
    database: process.env.DB_NAME || 'u748307513_fitdata',
    connectTimeout: 60000, // Aumenta el tiempo de espera a 60 segundos
};

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(connectionConfig);

    connection.connect(err => {
        if (err) {
            console.error('Error conectando a la base de datos:', err);
            setTimeout(handleDisconnect, 3000);
            return;
        }
        console.log('Conexión a la BD establecida');
    });

    connection.on('error', err => {
        console.error('Error de BD:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;