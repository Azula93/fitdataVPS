// aqui esta toda la logica para la autenticacion
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const connection = require('../database/db');
const { promisify } = require('util');
const { encrypt } = require('../helpers/handleBcrypt');

// procedimiento para register
// este metodo register que aparece aqui es propio de node, no es la ruta que ya definí para el formulario de registro
exports.register = async (req, res) => {

    try {
        const {nombreUsuario, email, pass,pass2} = req.body;

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

        //Insertar datos en la DB 
        connection.query('INSERT INTO users SET ?', { nombreUsuario: nombreUsuario, email: email, pass: passHash }, (error, results) => {
            if (error) {
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
            }
            res.render('register', {
                alert: true,
                alertTitle: "Registro Exitoso",
                alertMessage: "El usuario ha sido registrado exitosamente.",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: 'login'
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor.');
    }
}

// Procedimiento para el login

exports.login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
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

            connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {

                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
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
                    const id = results[0].id;
                    const token = jwt.sign({ id: id  }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRA * 24 * 60 * 60 * 1000),
                        httpOnly: true
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
                        nombreUsuario: results[0].nombreUsuario
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor.');
    }
}





// confirmar que el usuario esta autenticado
exports.isAuthenticated = async (req, res, next) => {
    if (!req.cookies.jwt) {
        req.user = null;
        return next();
    }

    try {
        // Decodificar el token JWT
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);

        // Consulta con Promesas
        const [results] = await connection.promise().query('SELECT * FROM users WHERE id = ?', [decoded.id]);

        if (results.length === 0) {
            req.user = null;
            return next();
        }

        req.user = results[0];
        next();
    } catch (error) {
        console.error('Error en isAuthenticated:', error);
        req.user = null;
        next();
    }
};

// sistema logOut
exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/')
}


