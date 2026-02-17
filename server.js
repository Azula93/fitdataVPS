const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const authController = require('./controllers/authController');

// Cargar variables de entorno
dotenv.config({ path: './env/.env' });

const pool = require('./database/db');

const app = express();

// Confiar en el proxy inverso (nginx) — necesario para req.secure, cookies Secure y rate-limit
app.set('trust proxy', 1);

// Headers de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",          // necesario para los bloques <script> inline en EJS
                "cdn.jsdelivr.net",          // Bootstrap, SweetAlert2, Popper
                "kit.fontawesome.com",       // FontAwesome
                "ka-f.fontawesome.com",      // FontAwesome (recursos del kit)
                "code.jquery.com",           // jQuery
                "stackpath.bootstrapcdn.com",
                "pagead2.googlesyndication.com", // Google AdSense
                "partner.googleadservices.com",
                "tpc.googlesyndication.com",
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",           // necesario para estilos inline
                "cdn.jsdelivr.net",
                "cdnjs.cloudflare.com",
                "stackpath.bootstrapcdn.com",
                "ka-f.fontawesome.com",
                "fonts.googleapis.com",      // Google Fonts (Poppins, etc.)
            ],
            imgSrc: [
                "'self'",
                "data:",
                "m.media-amazon.com",        // imágenes de productos Amazon
                "pagead2.googlesyndication.com",
                "googleads.g.doubleclick.net",
                "*.google.com",
            ],
            fontSrc: [
                "'self'",
                "ka-f.fontawesome.com",
                "cdnjs.cloudflare.com",
                "fonts.gstatic.com",         // Google Fonts (archivos de fuente)
            ],
            frameSrc: [
                "www.youtube.com",           // videos embebidos
                "youtube.com",
                "www.youtube-nocookie.com",  // modo privacidad mejorada de YouTube
                "googleads.g.doubleclick.net",
                "tpc.googlesyndication.com",
            ],
            connectSrc: [
                "'self'",
                "ka-f.fontawesome.com",
            ],
            frameAncestors: ["'none'"],      // protección clickjacking (reemplaza X-Frame-Options)
        },
    },
    // Headers adicionales habilitados por defecto con helmet():
    // X-Content-Type-Options: nosniff
    // X-DNS-Prefetch-Control: off
    // X-Download-Options: noopen
    // X-Permitted-Cross-Domain-Policies: none
    // Referrer-Policy: no-referrer
    // Strict-Transport-Security (HSTS)
    // X-XSS-Protection: 0 (desactiva el filtro XSS del navegador, que puede ser explotado)
}));

// Rate limiting — protección contra fuerza bruta y abuso
// Límite estricto para login y registro: 10 intentos por IP cada 15 minutos
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).render('login', {
            alert: true,
            alertTitle: 'Demasiados intentos',
            alertMessage: 'Has superado el límite de intentos. Por favor espera 15 minutos.',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
});

// Límite general para el resto de endpoints: 300 peticiones por IP cada 15 minutos
// (los archivos estáticos ya se sirven antes y no consumen esta cuota)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        // Si el cliente espera JSON (llamadas AJAX), devolver JSON
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
            return res.status(429).json({ error: 'Demasiadas peticiones. Por favor intenta más tarde.' });
        }
        // Si es una petición de navegador normal, mostrar página de login con alerta
        res.status(429).render('login', {
            alert: true,
            alertTitle: 'Demasiadas peticiones',
            alertMessage: 'Has realizado demasiadas peticiones. Por favor espera unos minutos e intenta de nuevo.',
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
});

app.use('/login', authLimiter);
app.use('/register', authLimiter);
app.use(generalLimiter);

// Middleware para manejar timeouts
app.use((req, res, next) => {
    // Establecer timeout de 30 segundos
    req.setTimeout(30000, () => {
        console.error('Request timeout');
        if (!res.headersSent) {
            res.status(504).json({
                alert: true,
                alertTitle: "Error",
                alertMessage: "La solicitud tard� demasiado tiempo. Por favor, intente nuevamente.",
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

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos ANTES del rate limiter — no deben consumir cuota
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/ads.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ads.txt'));
});

// Procesar datos enviados desde forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Sesión (necesaria para CSRF)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}));

// Generar token CSRF único por sesión y exponerlo a todas las vistas
app.use((req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
});

// Validar token CSRF en todas las peticiones que modifican datos
function validateCsrf(req, res, next) {
    const token = req.body._csrf || req.headers['x-csrf-token'];
    if (!token || token !== req.session.csrfToken) {
        return res.status(403).json({ error: 'Token CSRF inválido.' });
    }
    next();
}

// Llamar al router, donde est�n todas las rutas
app.use('/', require('./routes/router'));

// Guardar datos en la DB
app.post('/guardar-datos', authController.isAuthenticated, validateCsrf, async (req, res) => {
    try {
        const userId = req.user.id; // Obt�n el ID del usuario autenticado
        const { imc, icc, gasto_energetico, macro, vo2, mets, expect_vida } = req.body;

        const query = `
            INSERT INTO user_data (user_id, imc, icc, gasto_energetico, macro, vo2, mets, expect_vida)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (user_id) DO UPDATE SET 
                imc = COALESCE(EXCLUDED.imc, user_data.imc),
                icc = COALESCE(EXCLUDED.icc, user_data.icc),
                gasto_energetico = COALESCE(EXCLUDED.gasto_energetico, user_data.gasto_energetico),
                macro = COALESCE(EXCLUDED.macro, user_data.macro),
                vo2 = COALESCE(EXCLUDED.vo2, user_data.vo2),
                mets = COALESCE(EXCLUDED.mets, user_data.mets),
                expect_vida = COALESCE(EXCLUDED.expect_vida, user_data.expect_vida);
        `;

        const client = await pool.connect();
        await client.query(query, [userId, imc, icc, gasto_energetico, macro, vo2, mets, expect_vida]);
        client.release();

        res.status(200).send('Datos guardados exitosamente');
    } catch (err) {
        console.error('Error al guardar el dato:', err);
        res.status(500).send('Error al guardar el dato');
    }
});

// Eliminar datos de "misdatos"
app.delete('/eliminar-dato', authController.isAuthenticated, validateCsrf, async (req, res) => {
    if (!req.user) {
        return res.status(401).send('No autenticado.');
    }
    try {
        const userId = req.user.id;

        const client = await pool.connect();
        const result = await client.query('DELETE FROM user_data WHERE user_id = $1', [userId]);
        client.release();

        console.log(`Filas afectadas: ${result.rowCount}`);
        
        if (result.rowCount === 0) {
            return res.status(404).send('Dato no encontrado.');
        }

        res.status(200).send('Dato eliminado exitosamente.');
    } catch (error) {
        console.error('Error al eliminar el dato:', error);
        res.status(500).send('Error al eliminar el dato.');
    }
});

// Enviar datos del formulario de contacto
app.post('/submit', validateCsrf, async (req, res) => {
    const { name, email, message } = req.body;
  
    if (!name || !email || !message) {
        return res.status(400).send({ success: false, message: 'Todos los campos son obligatorios.' });
    }
  
    const sql = 'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)';
    const client = await pool.connect();
    try {
        await client.query(sql, [name, email, message]);
        res.status(200).send({ success: true, message: 'Mensaje enviado correctamente.' });
    } catch (err) {
        console.error('Error al guardar el mensaje:', err);
        res.status(500).send({ success: false, message: 'Error al guardar el mensaje.' });
    } finally {
        client.release();
    }
});
  
// Conexi�n al puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
