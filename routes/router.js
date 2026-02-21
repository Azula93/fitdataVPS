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

router.get('/cursos', authController.optionalAuth, (req, res) => {
    res.render('cursos', { user: req.user })
})

router.get('/anatomia', authController.optionalAuth, (req, res) => {
    res.render('anatomia', { user: req.user })
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
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).send('No se encontraron datos del usuario.');
        }

        const userData = result.rows[0];

        // ── Colores del design system ──
        const GREEN = '#22c55e';
        const GREEN_DARK = '#16a34a';
        const GREEN_SOFT = '#dcfce7';
        const YELLOW = '#f59e0b';
        const YELLOW_SOFT = '#fef3c7';
        const RED = '#ef4444';
        const RED_SOFT = '#fee2e2';
        const BLUE = '#3b82f6';
        const BLUE_SOFT = '#dbeafe';
        const DARK = '#0f172a';
        const GRAY = '#334155';
        const GRAY_LIGHT = '#94a3b8';
        const BORDER = '#e2e8f0';
        const LIGHT = '#f8fafc';

        // ── Interpretación clínica (misma lógica que misdatos.ejs) ──
        const imcNum = parseFloat(userData.imc);
        let imcColor = GRAY_LIGHT, imcBadge = 'Sin datos', imcBadgeBg = LIGHT;
        if (!isNaN(imcNum)) {
            if      (imcNum < 18.5) { imcColor = RED;    imcBadge = 'Bajo peso';    imcBadgeBg = RED_SOFT; }
            else if (imcNum < 25)   { imcColor = GREEN;  imcBadge = 'Peso normal';  imcBadgeBg = GREEN_SOFT; }
            else if (imcNum < 30)   { imcColor = YELLOW; imcBadge = 'Sobrepeso';    imcBadgeBg = YELLOW_SOFT; }
            else if (imcNum < 35)   { imcColor = RED;    imcBadge = 'Obesidad I';   imcBadgeBg = RED_SOFT; }
            else                    { imcColor = RED;    imcBadge = 'Obesidad II+'; imcBadgeBg = RED_SOFT; }
        }

        const iccNum = parseFloat(userData.icc);
        let iccColor = GRAY_LIGHT, iccBadge = 'Sin datos', iccBadgeBg = LIGHT;
        if (!isNaN(iccNum)) {
            if      (iccNum < 0.80) { iccColor = GREEN;  iccBadge = 'Bajo riesgo';     iccBadgeBg = GREEN_SOFT; }
            else if (iccNum < 0.90) { iccColor = YELLOW; iccBadge = 'Riesgo moderado'; iccBadgeBg = YELLOW_SOFT; }
            else                    { iccColor = RED;    iccBadge = 'Riesgo alto';     iccBadgeBg = RED_SOFT; }
        }

        const vo2Num = parseFloat(userData.vo2);
        let vo2Color = GRAY_LIGHT, vo2Badge = 'Sin datos', vo2BadgeBg = LIGHT;
        if (!isNaN(vo2Num)) {
            if      (vo2Num < 30) { vo2Color = RED;    vo2Badge = 'Bajo';      vo2BadgeBg = RED_SOFT; }
            else if (vo2Num < 40) { vo2Color = YELLOW; vo2Badge = 'Moderado';  vo2BadgeBg = YELLOW_SOFT; }
            else if (vo2Num < 50) { vo2Color = GREEN;  vo2Badge = 'Bueno';     vo2BadgeBg = GREEN_SOFT; }
            else                  { vo2Color = GREEN;  vo2Badge = 'Excelente'; vo2BadgeBg = GREEN_SOFT; }
        }

        const metsNum = parseFloat(userData.mets);
        let metsColor = GRAY_LIGHT, metsBadge = 'Sin datos', metsBadgeBg = LIGHT;
        if (!isNaN(metsNum)) {
            if      (metsNum < 3) { metsColor = YELLOW; metsBadge = 'Sedentario'; metsBadgeBg = YELLOW_SOFT; }
            else if (metsNum < 6) { metsColor = GREEN;  metsBadge = 'Moderado';   metsBadgeBg = GREEN_SOFT; }
            else                  { metsColor = BLUE;   metsBadge = 'Vigoroso';   metsBadgeBg = BLUE_SOFT; }
        }

        // ── Crear PDF ──
        const doc = new PDFDocument({ size: 'A4', margins: { top: 40, bottom: 40, left: 50, right: 50 } });
        const font = './public/font/Poppins-Regular.ttf';
        doc.font(font);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Resultados_${userName}.pdf"`);
        doc.pipe(res);

        const pageW = doc.page.width;
        const marginL = 50;
        const marginR = 50;
        const contentW = pageW - marginL - marginR;

        // ── Helper: rectángulo redondeado ──
        function roundedRect(x, y, w, h, r) {
            doc.moveTo(x + r, y)
               .lineTo(x + w - r, y)
               .quadraticCurveTo(x + w, y, x + w, y + r)
               .lineTo(x + w, y + h - r)
               .quadraticCurveTo(x + w, y + h, x + w - r, y + h)
               .lineTo(x + r, y + h)
               .quadraticCurveTo(x, y + h, x, y + h - r)
               .lineTo(x, y + r)
               .quadraticCurveTo(x, y, x + r, y)
               .closePath();
        }

        // ══════════════════════════════════════════
        // HEADER — barra verde con marca
        // ══════════════════════════════════════════
        doc.rect(0, 0, pageW, 72).fill(DARK);
        doc.rect(0, 68, pageW, 4).fill(GREEN);

        doc.fontSize(22).fillColor('#ffffff')
           .text('Fit', marginL, 22, { continued: true })
           .fillColor(GREEN).text('Data', { continued: false });

        doc.fontSize(9).fillColor('#94a3b8')
           .text('Informe de resultados', pageW - marginR - 150, 30, { width: 150, align: 'right' });

        // ── Info usuario + fecha ──
        const now = new Date();
        const fechaStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        const updatedAt = userData.updated_at
            ? new Date(userData.updated_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
            : fechaStr;

        doc.fontSize(10).fillColor(GRAY)
           .text(`Usuario: `, marginL, 92, { continued: true })
           .fillColor(DARK).text(userName);
        doc.fontSize(9).fillColor(GRAY)
           .text(`Fecha del informe: ${fechaStr}`, marginL, 108);
        doc.fontSize(9).fillColor(GRAY)
           .text(`Ultima actualizacion: ${updatedAt}`, marginL, 121);

        // Linea separadora
        doc.moveTo(marginL, 140).lineTo(pageW - marginR, 140).strokeColor(BORDER).lineWidth(1).stroke();

        // ══════════════════════════════════════════
        // SECCIÓN: RESULTADOS
        // ══════════════════════════════════════════
        doc.fontSize(13).fillColor(DARK).text('Tus resultados', marginL, 152);
        doc.fontSize(8).fillColor(GRAY).text('Datos calculados con formulas cientificas validadas', marginL, 168);

        // ── Helper: dibujar tarjeta de métrica ──
        function drawMetricCard(x, y, w, h, label, value, badge, color, badgeBg, desc) {
            // Borde + fondo
            roundedRect(x, y, w, h, 8);
            doc.fillAndStroke('#ffffff', BORDER);

            // Barra superior de color
            doc.save();
            doc.rect(x, y, w, 5).clip();
            roundedRect(x, y, w, 8, 8);
            doc.fill(color);
            doc.restore();

            // Label
            doc.fontSize(7.5).fillColor(GRAY)
               .text(label.toUpperCase(), x + 12, y + 14, { width: w - 24, lineBreak: false });

            // Valor
            doc.fontSize(18).fillColor(DARK)
               .text(value || '—', x + 12, y + 27, { width: w - 24, lineBreak: false });

            // Badge
            const badgeW = doc.widthOfString(badge, { fontSize: 7 }) + 16;
            roundedRect(x + 12, y + 52, badgeW, 16, 8);
            doc.fill(badgeBg);
            doc.fontSize(7).fillColor(color)
               .text(badge, x + 20, y + 55, { width: badgeW, lineBreak: false });

            // Descripción
            if (desc) {
                doc.fontSize(7).fillColor(GRAY_LIGHT)
                   .text(desc, x + 12, y + 74, { width: w - 24, lineGap: 1, lineBreak: false });
            }
        }

        // ── Layout: 2 columnas x 3 filas ──
        const cardW = (contentW - 16) / 2;
        const cardH = 100;
        const gap = 16;
        let startY = 186;

        // Fila 1: IMC + ICC
        const imcVal = userData.imc ? String(userData.imc).split(' ')[0] : null;
        const imcDesc = 'Relacion peso/estatura. Indicador basico de estado nutricional.';
        drawMetricCard(marginL, startY, cardW, cardH,
            'IMC — Indice de Masa Corporal', imcVal, imcBadge, imcColor, imcBadgeBg, imcDesc);

        const iccVal = userData.icc ? String(userData.icc).split(' ')[0] : null;
        const iccDesc = 'Distribucion de grasa corporal y riesgo cardiovascular.';
        drawMetricCard(marginL + cardW + gap, startY, cardW, cardH,
            'ICC — Indice Cintura-Cadera', iccVal, iccBadge, iccColor, iccBadgeBg, iccDesc);

        // Fila 2: GET + VO2
        startY += cardH + gap;
        const getVal = userData.gasto_energetico || null;
        const getDesc = 'Calorias diarias segun tu nivel de actividad fisica.';
        drawMetricCard(marginL, startY, cardW, cardH,
            'GET — Gasto Energetico Total', getVal, 'Gasto energetico', BLUE, BLUE_SOFT, getDesc);

        const vo2Val = userData.vo2 || null;
        const vo2Desc = 'Capacidad maxima de oxigeno. Indicador de salud cardiovascular.';
        drawMetricCard(marginL + cardW + gap, startY, cardW, cardH,
            'VO2 Maximo', vo2Val, vo2Badge, vo2Color, vo2BadgeBg, vo2Desc);

        // Fila 3: METs + Expect. Vida
        startY += cardH + gap;
        const metsVal = userData.mets || null;
        const metsDesc = 'Intensidad de actividad fisica. 1 MET = gasto en reposo.';
        drawMetricCard(marginL, startY, cardW, cardH,
            'METs — Equivalentes Metabolicos', metsVal, metsBadge, metsColor, metsBadgeBg, metsDesc);

        const evVal = userData.expect_vida || null;
        const evDesc = 'Estimacion basada en tus indicadores de salud actuales.';
        drawMetricCard(marginL + cardW + gap, startY, cardW, cardH,
            'Expectativa de Vida', evVal, 'Estimacion', GRAY_LIGHT, LIGHT, evDesc);

        // ══════════════════════════════════════════
        // SECCIÓN: MACRONUTRIENTES (tarjeta ancha)
        // ══════════════════════════════════════════
        startY += cardH + gap;

        if (userData.macro) {
            doc.fontSize(13).fillColor(DARK).text('Macronutrientes', marginL, startY, { lineBreak: false });
            doc.fontSize(8).fillColor(GRAY).text('Distribucion diaria recomendada', marginL, startY + 16, { lineBreak: false });
            startY += 34;

            const macroH = 60;
            roundedRect(marginL, startY, contentW, macroH, 8);
            doc.fillAndStroke('#ffffff', BORDER);

            // Barra superior
            doc.save();
            doc.rect(marginL, startY, contentW, 5).clip();
            roundedRect(marginL, startY, contentW, 8, 8);
            doc.fill(GREEN);
            doc.restore();

            // Parsear macros (formato: "Carbs X gr\nProts Y gr\nFats Z gr")
            const macroLines = String(userData.macro).split('\n').filter(l => l.trim());
            const colW = contentW / Math.max(macroLines.length, 1);

            macroLines.forEach((line, i) => {
                const xPos = marginL + (colW * i) + 16;
                doc.fontSize(9).fillColor(DARK)
                   .text(line.trim(), xPos, startY + 18, { width: colW - 32, lineBreak: false });
            });

            startY += macroH;
        }

        // ══════════════════════════════════════════
        // SECCIÓN: RANGOS DE REFERENCIA
        // ══════════════════════════════════════════
        startY += gap;

        // La sección de rangos necesita ~220px (titulo + 2 bloques de rangos)
        // El footer necesita ~50px, así que el límite seguro es page.height - 60 - 10 = ~770
        const maxContentY = doc.page.height - 90;
        const rangesHeight = 36 + 76 + 76; // titulo + IMC/ICC + VO2/METs

        if (startY + rangesHeight > maxContentY) {
            doc.addPage();
            startY = 50;
        }

        doc.fontSize(13).fillColor(DARK).text('Rangos de referencia', marginL, startY, { lineBreak: false });
        doc.fontSize(8).fillColor(GRAY).text('Para interpretar correctamente tus resultados', marginL, startY + 16, { lineBreak: false });
        startY += 36;

        // Helper: fila de rango con punto de color
        function drawRange(x, y, color, text) {
            doc.circle(x + 4, y + 4, 4).fill(color);
            doc.fontSize(8).fillColor(GRAY).text(text, x + 14, y, { width: contentW / 2 - 30, lineBreak: false });
        }

        const col1X = marginL;
        const col2X = marginL + contentW / 2;

        // IMC ranges
        doc.fontSize(9).fillColor(DARK).text('IMC', col1X, startY, { lineBreak: false });
        drawRange(col1X, startY + 14, RED, '< 18.5 — Bajo peso');
        drawRange(col1X, startY + 28, GREEN, '18.5 – 24.9 — Peso normal');
        drawRange(col1X, startY + 42, YELLOW, '25.0 – 29.9 — Sobrepeso');
        drawRange(col1X, startY + 56, RED, '30.0 o mas — Obesidad');

        // ICC ranges
        doc.fontSize(9).fillColor(DARK).text('ICC', col2X, startY, { lineBreak: false });
        drawRange(col2X, startY + 14, GREEN, '< 0.80 — Bajo riesgo');
        drawRange(col2X, startY + 28, YELLOW, '0.80 – 0.89 — Riesgo moderado');
        drawRange(col2X, startY + 42, RED, '0.90 o mas — Riesgo alto');

        startY += 76;

        // VO2 ranges
        doc.fontSize(9).fillColor(DARK).text('VO2 Maximo (ml/kg/min)', col1X, startY, { lineBreak: false });
        drawRange(col1X, startY + 14, RED, '< 30 — Capacidad baja');
        drawRange(col1X, startY + 28, YELLOW, '30 – 39 — Capacidad moderada');
        drawRange(col1X, startY + 42, GREEN, '40 – 49 — Buena capacidad');
        drawRange(col1X, startY + 56, GREEN, '50 o mas — Excelente');

        // METs ranges
        doc.fontSize(9).fillColor(DARK).text('METs', col2X, startY, { lineBreak: false });
        drawRange(col2X, startY + 14, YELLOW, '1 – 2.9 — Actividad leve');
        drawRange(col2X, startY + 28, GREEN, '3 – 5.9 — Actividad moderada');
        drawRange(col2X, startY + 42, BLUE, '6 o mas — Actividad vigorosa');

        // ══════════════════════════════════════════
        // FOOTER (en la última página, después del contenido)
        // ══════════════════════════════════════════
        const footerY = doc.page.height - 75;
        doc.moveTo(marginL, footerY).lineTo(pageW - marginR, footerY).strokeColor(BORDER).lineWidth(1).stroke();

        doc.fontSize(7).fillColor(GRAY_LIGHT)
           .text('Este informe es orientativo y no sustituye el criterio de un profesional de la salud.', marginL, footerY + 8, { width: contentW, align: 'center', lineBreak: false });
        doc.fontSize(7).fillColor(GRAY_LIGHT)
           .text(`FitData — Generado el ${fechaStr}`, marginL, footerY + 20, { width: contentW, align: 'center', lineBreak: false });

        doc.end();
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
