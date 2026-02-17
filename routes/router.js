const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pool = require('../database/db');
const PDFDocument = require('pdfkit');

function validateCsrf(req, res, next) {
    const token = req.body._csrf || req.headers['x-csrf-token'];
    if (!token || token !== req.session.csrfToken) {
        return res.status(403).send('Token CSRF inválido.');
    }
    next();
}

// router para las vistas
// se coloca authController.isAuthenticated para asegurar que el usuario si tiene las credenciales para ingresar al sistema, que si esta autenticado 
router.get('/', authController.optionalAuth, (req, res) => {
    res.render('index', { user: req.user })
})

router.get('/login', (req, res) => {
    res.render('login', { alert: false });
})

router.get('/register', (req, res) => {
    res.render('register', { alert: false })
})

router.get('/panelcontrol', authController.isAuthenticated, async (req, res) => {
    const frases = [
        { texto: "La consistencia es el puente entre tus objetivos y tus logros.", autor: "Anónimo" },
        { texto: "Tu cuerpo puede hacerlo. Es tu mente la que tienes que convencer.", autor: "Anónimo" },
        { texto: "Cada vez que entrenas, te conviertes en una versión mejor de ti mismo.", autor: "FitData" },
        { texto: "La nutrición es el cimiento de tu rendimiento físico.", autor: "FitData" },
        { texto: "Pequeños cambios diarios llevan a grandes transformaciones.", autor: "Anónimo" },
        { texto: "El único mal entrenamiento es el que no hiciste.", autor: "Anónimo" },
        { texto: "Tu salud es una inversión, no un gasto.", autor: "Anónimo" },
        { texto: "Comer bien no es una restricción, es un acto de amor propio.", autor: "FitData" },
        { texto: "El éxito en el fitness se construye hábito a hábito.", autor: "FitData" },
        { texto: "No busques la perfección, busca el progreso.", autor: "Anónimo" },
        { texto: "Hidratarse es tan importante como entrenar. Bebe agua constantemente.", autor: "FitData" },
        { texto: "Descansar también es parte del proceso. Tu cuerpo se reconstruye en el sueño.", autor: "FitData" },
        { texto: "Un cuerpo activo envejece más lento. Muévete cada día.", autor: "FitData" },
        { texto: "Las proteínas son los ladrillos con los que construyes tu mejor versión.", autor: "FitData" },
        { texto: "El VO₂ máximo es el termómetro de tu salud cardiovascular.", autor: "FitData" },
        { texto: "Cada porción de frutas y verduras es un paso hacia una vida más larga.", autor: "FitData" },
        { texto: "La disciplina te lleva donde la motivación no alcanza.", autor: "Anónimo" },
        { texto: "Un buen balance de macronutrientes es la base de la energía diaria.", autor: "FitData" },
        { texto: "El IMC es solo un número, pero tu bienestar es un estilo de vida.", autor: "FitData" },
        { texto: "No compares tu progreso con el de otros. Compárate solo con quien eras ayer.", autor: "Anónimo" },
        { texto: "El ejercicio es el antidepresivo más poderoso y económico que existe.", autor: "Anónimo" },
        { texto: "Cuida tu alimentación y ella cuidará tu salud.", autor: "Anónimo" },
        { texto: "Los grandes atletas no nacen, se hacen con dedicación y constancia.", autor: "FitData" },
        { texto: "Cada gramo de fibra en tu dieta es un aliado de tu digestión.", autor: "FitData" },
        { texto: "La salud es riqueza. Invierte en ella cada día.", autor: "Anónimo" },
        { texto: "Moverse es vivir. Encuentra tu actividad favorita y hazla parte de tu rutina.", autor: "FitData" },
        { texto: "Las grasas saludables no son el enemigo; son combustible para tu cerebro.", autor: "FitData" },
        { texto: "Medir tu progreso te ayuda a mantener el rumbo hacia tus metas.", autor: "FitData" },
        { texto: "El desayuno no es solo una comida, es el combustible para tu día.", autor: "FitData" },
        { texto: "Un paso a la vez, un día a la vez. Así se construyen los cambios duraderos.", autor: "FitData" },
    ];
    const indice = Math.floor(Date.now() / 86400000) % frases.length;

    let userData = null;
    try {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM user_data WHERE user_id = $1', [req.user.id]);
            userData = result.rows[0] || null;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error al cargar datos del panel:', err);
    }

    res.render('panelcontrol', { user: req.user, frase: frases[indice], userData });
})

router.get('/indicesantr', authController.optionalAuth, (req, res) => {
    res.render('indicesantr', { user: req.user })
})

router.get('/icc', authController.optionalAuth, (req, res) => {
    res.render('icc', { user: req.user })
})

router.get('/valoracion', authController.optionalAuth, (req, res) => {
    res.render('valoracion', { user: req.user })
})

router.get('/pruebaEsfuerzo', authController.optionalAuth, (req, res) => {
    res.render('pruebaEsfuerzo', { user: req.user })
})

router.get('/blog', authController.optionalAuth, (req, res) => {
    res.render('blog', { user: req.user })
})

router.get('/formularios', authController.isAuthenticated, (req, res) => {
    res.render('formularios', { user: req.user })
})

router.get('/aboutUs', authController.optionalAuth, (req, res) => {
    res.render('aboutUs', { user: req.user })
})

router.get('/privacyPolicy', authController.optionalAuth, (req, res) => {
    res.render('privacyPolicy', { user: req.user })
})

router.get('/politicacookies', authController.optionalAuth, (req, res) => {
    res.render('politica-de-cookies', { user: req.user })
})

router.get('/avisoLegal', authController.optionalAuth, (req, res) => {
    res.render('avisoLegal', { user: req.user })
})

router.get('/contact', authController.optionalAuth, (req, res) => {
    res.render('contact', { user: req.user })
})

router.get('/etiquetasNutricionales', authController.optionalAuth, (req, res) => {
    res.render('etiquetasNutricionales', { user: req.user })
})

router.get('/productos', authController.optionalAuth, (req, res) => {
    res.render('productos', { user: req.user })
})

router.get('/implementosDeportivos', authController.optionalAuth, (req, res) => {
    res.render('implementosDeportivos', { user: req.user })
})

router.get('/evolMarcas', authController.optionalAuth, (req, res) => {
    res.render('evolMarcas', { user: req.user })
})

router.get('/clasAlimentos', authController.optionalAuth, (req, res) => {
    res.render('clasAlimentos', { user: req.user })
})


// router para las vistas

router.get('/misdatos', authController.isAuthenticated, async (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT * FROM user_data WHERE user_id = $1';
    try {
        const client = await pool.connect();
        const result = await client.query(query, [userId]);

        res.render('misdatos', {
            datos: result.rows[0] || {}, 
            user: req.user
        });

        client.release();
    } catch (err) {
        console.error('Error al recuperar los datos:', err);
        res.status(500).send('Error al recuperar los datos');
    }
});


// GENERA PDF
router.get('/generar-pdf', authController.isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const userName = req.user.nombreUsuario;

        const client = await pool.connect();
        const queryText = 'SELECT * FROM user_data WHERE user_id = $1';
        const result = await client.query(queryText, [userId]);
        client.release(); // liberar la conexión antes de generar el PDF

        if (result.rows.length === 0) {
            return res.status(404).send('No se encontraron datos del usuario.');
        }

        const userData = result.rows[0];

        // Crear el PDF
        const doc = new PDFDocument();
        doc.font('./public/font/Poppins-Regular.ttf');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Resultados_${userName}.pdf"`);

        // Pipe transmite el PDF directo a la respuesta y la cierra al terminar
        doc.pipe(res);

        doc.fontSize(25).text(`Resultados ${userName}`, { align: 'center' });

        // Config TABLA
        const tableTop = 160;
        const itemHeight = 65;
        const columnWidth = 150;
        const startX = 100;
        const startY = tableTop;

        // Encabezados de la tabla
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
            userData.imc || '',
            userData.icc || 'N/A',
            userData.gasto_energetico || 'N/A',
            userData.macro || 'N/A',
            userData.vo2 || 'N/A',
            userData.mets || 'N/A',
            userData.expect_vida || 'N/A'
        ];

        // Escribir los datos en el PDF
        titles.forEach((title, index) => {
            const yPosition = startY + (index + 1) * itemHeight;
            doc.text(title, startX, yPosition)
               .text(values[index], startX + columnWidth, yPosition);
        });

        doc.end(); // finaliza el PDF y cierra la respuesta automáticamente
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send('Error en el servidor.');
        }
    }
});

// router para los metodos del controller 
router.post('/register', validateCsrf, authController.register);
router.post('/login', validateCsrf, authController.login);
router.get('/logout', authController.logout);


module.exports = router;
