const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
const { promisify } = require('util');
const { encrypt } = require('../helpers/handleBcrypt');

dotenv.config({ path: './env/.env' });

const pool = require('../database/db');

// Validación de email con regex estándar
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// procedimiento para register
// este metodo register que aparece aqui es propio de node, no es la ruta que ya definí para el formulario de registro
exports.register = async (req, res) => {
    try {
        const nombreUsuario = (req.body.nombreUsuario || '').trim();
        const email = (req.body.email || '').trim().toLowerCase();
        const pass = req.body.pass || '';
        const pass2 = req.body.pass2 || '';

        // Validar que todos los campos estén presentes
        if (!nombreUsuario || !email || !pass || !pass2) {
            return res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Todos los campos son obligatorios.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        // Validar longitud del nombre de usuario (2-50 caracteres)
        if (nombreUsuario.length < 2 || nombreUsuario.length > 50) {
            return res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "El nombre de usuario debe tener entre 2 y 50 caracteres.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        // Validar formato de email
        if (!isValidEmail(email) || email.length > 100) {
            return res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ingresa un email válido.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        // Validar requisitos de contraseña (mínimo 8 caracteres)
        if (pass.length < 8) {
            return res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "La contraseña debe tener al menos 8 caracteres.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        // Verificar si las contraseñas coinciden
        if (pass !== pass2) {
            return res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Las contraseñas no coinciden.",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        // encriptando la contraseña
        const passHash = await encrypt(pass);

        // Insertar datos en la DB 
        const client = await pool.connect();
        const queryText = 'INSERT INTO users (nombreUsuario, email, pass) VALUES ($1, $2, $3)';
        const values = [nombreUsuario, email, passHash];

        try {
            await client.query(queryText, values);
            res.render('register', {
                alert: true,
                alertTitle: "Registro Exitoso",
                alertMessage: "El usuario ha sido registrado exitosamente.",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: 'login'
            });
        } catch (error) {
            console.log(error);
            return res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ingresa todos tus datos para registrarte",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor.');
    }
}

// Procedimiento para el login
exports.login = async (req, res) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const pass = req.body.pass || '';

        if (!email || !pass || email.length > 100) {
            return res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingresa tus datos para iniciar sesión",
                alertIcon: "info",
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        } else {
            const client = await pool.connect();
            const queryText = 'SELECT * FROM users WHERE email = $1';
            const values = [email];

            try {
                const result = await client.query(queryText, values);

                if (result.rows.length == 0 || !(await bcryptjs.compare(pass, result.rows[0].pass))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Email y/o contraseña incorrectos",
                        alertIcon: "info",
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                } else {
                    // Inicio de sesión válido
                    const id = result.rows[0].id;
                    const token = jwt.sign({ id: id  }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRA * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    };

                    res.cookie('jwt', token, cookiesOptions);

                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión Exitosa",
                        alertMessage: "Bienvenido a FitData!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 800,
                        ruta: 'panelcontrol',  // Cambia esta ruta a 'panel-control'
                        nombreUsuario: result.rows[0].nombreusuario
                    });
                }
            } catch (error) {
                console.log(error);
                res.status(500).send('Error en el servidor.');
            } finally {
                client.release();
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor.');
    }
}

// confirmar que el usuario esta autenticado
exports.isAuthenticated = async (req, res, next) => {
    if (!req.cookies.jwt) {
        return res.redirect('/login');
    }

    try {
        // Decodificar el token JWT
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);

        // Consulta con Promesas
        const client = await pool.connect();
        const queryText = 'SELECT id, nombreusuario AS "nombreUsuario", email FROM users WHERE id = $1';
        const values = [decoded.id];

        try {
            const result = await client.query(queryText, values);

            if (result.rows.length === 0) {
                res.clearCookie('jwt');
                return res.redirect('/login');
            }

            req.user = result.rows[0];
            next();
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error en isAuthenticated:', error);
        res.clearCookie('jwt');
        return res.redirect('/login');
    }
};

// Middleware para rutas públicas: carga el usuario si hay sesión, pero no bloquea si no hay
exports.optionalAuth = async (req, res, next) => {
    req.user = null;
    if (!req.cookies.jwt) return next();

    try {
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT id, nombreusuario AS "nombreUsuario", email FROM users WHERE id = $1',
                [decoded.id]
            );
            if (result.rows.length > 0) req.user = result.rows[0];
        } finally {
            client.release();
        }
    } catch {
        res.clearCookie('jwt');
    }
    next();
};

// sistema logOut
exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}
