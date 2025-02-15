const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const connection = require('./database/db');
const authController = require('./controllers/authController');

// Cargar variables de entorno
dotenv.config({ path: './env/.env' });

const app = express();

//codigfo de copilot
// Middleware para manejar timeouts
app.use((req, res, next) => {
    // Establecer timeout de 30 segundos
    req.setTimeout(30000, () => {
        console.error('Request timeout');
        if (!res.headersSent) {
            res.status(504).json({
                alert: true,
                alertTitle: "Error",
                alertMessage: "La solicitud tardó demasiado tiempo. Por favor, intente nuevamente.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }
    });
    next();
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err);
    if (!res.headersSent) {
        res.status(500).json({
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error en el servidor. Por favor, intente nuevamente.",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: 'login',
            debug: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


//codigo de copilot

//variables de entorno
dotenv.config({ path: './env/.env' });

// motor de plantillas 
app.set('view engine', 'ejs');

// se usa para mostrar los archivos estaticos
app.use('/public', express.static(path.join(__dirname, 'public')));

// Procesar datos enviados desde forms
app.use(express.json());
// esta linea 👇 hace que se tomen los datos provenientes de html y el servidor los pueda leer como un objeto, se debe usar siempre que se quiera traer datos de un formulario o similar
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));


// cookies
app.use(cookieParser());

// llamar al router, donde estan todas las rutas 
app.use('/', require('./routes/router'));

// ******CODIGO PARA GUARDAR LOS DATOS EN LA DB ******
app.post('/guardar-datos', authController.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id; // Obtén el ID del usuario autenticado
        const { imc, icc, gasto_energetico, macro, vo2, mets, expect_vida } = req.body;

        const query = `
            INSERT INTO user_data (user_id, imc, icc, gasto_energetico, macro, vo2, mets, expect_vida)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                imc = COALESCE(VALUES(imc), imc),
                icc = COALESCE(VALUES(icc), icc),
                gasto_energetico = COALESCE(VALUES(gasto_energetico), gasto_energetico),
                macro = COALESCE(VALUES(macro), macro),
                vo2 = COALESCE(VALUES(vo2), vo2),
                mets = COALESCE(VALUES(mets), mets),
                expect_vida = COALESCE(VALUES(expect_vida), expect_vida);
        `;

        // Usa Promesas para ejecutar la consulta
        const [results] = await connection.promise().query(query, [userId, imc, icc, gasto_energetico, macro, vo2, mets, expect_vida]);

        console.log('Resultados:', results);
        res.status(200).send('Datos guardados exitosamente');

    } catch (err) {
        console.error('Error al guardar el dato:', err);
        res.status(500).send('Error al guardar el dato');
    }
});




// ******CODIGO PARA GUARDAR LOS DATOS EN LA DB ******


// ELIMINAR DATOS DE "misdatos"
app.delete('/eliminar-dato/:id', authController.isAuthenticated, async (req, res) => {
    try {
        const userId = req.params.id;

        // Consulta usando Promesas
        const [results] = await connection.promise().query(
            'DELETE FROM user_data WHERE user_id = ?',
            [userId]
        );

        console.log(`Filas afectadas: ${results.affectedRows}`);
        
        if (results.affectedRows === 0) {
            return res.status(404).send('Dato no encontrado.');
        }

        res.status(200).send('Dato eliminado exitosamente.');
    } catch (error) {
        console.error('Error al eliminar el dato:', error);
        res.status(500).send('Error al eliminar el dato.');
    }
});


// ELIMINAR DATOS DE "misdatos"

// ENVIAR DATOS DEL FORM CONTACTANOS 
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
      return res.status(400).send({ success: false, message: 'Todos los campos son obligatorios.' });
    }
  
    const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, message], (err, result) => {
      if (err) {
        console.error('Error al guardar el mensaje:', err);
        return res.status(500).send({ success: false, message: 'Error al guardar el mensaje.' });
      }
  
      res.status(200).send({ success: true, message: 'Mensaje enviado correctamente.' });
    });
  });
  
// ENVIAR DATOS DEL FORM CONTACTANOS *******




// conexion al puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
