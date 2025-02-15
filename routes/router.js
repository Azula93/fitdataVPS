const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const connection = require('../database/db');
const PDFDocument = require('pdfkit');

// router para las vistas
// se coloca authController.isAuthenticated para asegurar que el usuario si tiene las credenciales para ingresar al sistema, que si esta autenticado 
router.get('/', authController.isAuthenticated, (req, res) => {
    res.render('index', { user: req.user })
})

router.get('/login', (req, res) => {
    res.render('login', { alert: false });
})

router.get('/register', (req, res) => {
    res.render('register', { alert: false })
})

router.get('/panelcontrol', authController.isAuthenticated, (req, res) => {
    res.render('panelcontrol', { user: req.user })
})

router.get('/indicesantr', authController.isAuthenticated, (req, res) => {
    res.render('indicesantr', { user: req.user })
})

router.get('/valoracion', authController.isAuthenticated, (req, res) => {
    res.render('valoracion', { user: req.user })
})

router.get('/pruebaEsfuerzo', authController.isAuthenticated, (req, res) => {
    res.render('pruebaEsfuerzo', { user: req.user })
})

router.get('/blog', authController.isAuthenticated, (req, res) => {
    res.render('blog', { user: req.user })
})

router.get('/formularios', authController.isAuthenticated, (req, res) => {
    res.render('formularios', { user: req.user })
})

router.get('/aboutUs', authController.isAuthenticated, (req, res) => {
    res.render('aboutUs', { user: req.user })
})

router.get('/privacyPolicy', authController.isAuthenticated, (req, res) => {
    res.render('privacyPolicy', { user: req.user })
})

router.get('/politicacookies', authController.isAuthenticated, (req, res) => {
    res.render('politica-de-cookies', { user: req.user })
})

router.get('/avisoLegal', authController.isAuthenticated, (req, res) => {
    res.render('avisoLegal', { user: req.user })
})

router.get('/contact', authController.isAuthenticated, (req, res) => {
    res.render('contact', { user: req.user })
})

router.get('/etiquetasNutricionales', authController.isAuthenticated, (req, res) => {
    res.render('etiquetasNutricionales', { user: req.user })
})

router.get('/productos', authController.isAuthenticated, (req, res) => {
    res.render('productos', { user: req.user })
})

router.get('/implementosDeportivos', authController.isAuthenticated, (req, res) => {
    res.render('implementosDeportivos', { user: req.user })
})

router.get('/evolMarcas', authController.isAuthenticated, (req, res) => {
    res.render('evolMarcas', { user: req.user })
})

router.get('/clasAlimentos', authController.isAuthenticated, (req, res) => {
    res.render('clasAlimentos', { user: req.user })
})



// router para las vistas


router.get('/misdatos',authController.isAuthenticated, (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT * FROM user_data WHERE user_id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al recuperar los datos:', err);
            return res.status(500).send('Error al recuperar los datos');
        }

        res.render('misdatos', {
            datos: results[0] || {}, 
            user: req.user
        });
    });
});

// GENERA PDF
router.get('/generar-pdf', authController.isAuthenticated, (req, res) => {
    try {
        const userId = req.user.id;
        const userName = req.user.nombreUsuario;

        connection.query('SELECT * FROM user_data WHERE user_id = ?', [userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error al obtener los datos del usuario.');
            }

            // Crear el PDF
            const doc = new PDFDocument();
            doc.font('./public/font/Poppins-Regular.ttf');

            // Establecer el encabezado Content-Type para mostrar el PDF en el navegador
            res.setHeader('Content-Type', 'application/pdf');

            // Establecer el encabezado Content-Disposition para mostrar el PDF en el navegador
            res.setHeader('Content-Disposition', 'inline; filename="user_data.pdf"');

            // Enviar el PDF directamente a la respuesta
            doc.pipe(res);

            doc.fontSize(25).text(`Resultados ${userName}`, { align: 'center' });

            // Config TABLA
            const tableTop = 160;
            const itemHeight = 65;
            const columnWidth = 150; // Ancho de cada columna
            const startX = 100; // Posición X para la columna "Valor"
            const startY = tableTop; // Posición Y para el inicio de la tabla

            // Encabezados de la tabla vertical
            doc.fontSize(12)
                .text('Parametro', startX, startY)
                .text('Datos del Usuario', startX + columnWidth, startY);

            // Títulos de la tabla vertical
            doc.fontSize(10);
            const titles = [
                'IMC:', 
                'ICC:', 
                'GET:', 
                'Macronutrientes:', 
                'VO2:', 
                'METS:', 
                'Expect Vida:'
            ];

            // Datos de los resultados
            const values = [
                results[0].imc || '',
                results[0].icc || 'N/A',
                results[0].gasto_energetico || 'N/A',
                results[0].macro || 'N/A',
                results[0].vo2 || 'N/A',
                results[0].mets || 'N/A',
                results[0].expect_vida || 'N/A'
            ];

            // Escribir los datos en el PDF
            titles.forEach((title, index) => {
                const yPosition = startY + (index + 1) * itemHeight;
                doc.text(title, startX, yPosition)
                   .text(values[index], startX + columnWidth, yPosition);
            });

            doc.end();

            // Esperar a que el PDF se escriba antes de responder
            doc.on('finish', () => {
                res.redirect(`Resultados_${userName}`); // Redirige para abrir el PDF en una nueva pestaña
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor.');
    }
});


// router para los metodos del controller 
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);


module.exports = router;
