const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const basicAuthMiddleware = require('../middlewares/basicAuth'); // ruta correcta
const User = require('../models/users');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'thisismysecret';



// GENERAR TOKEN (BasicAuth → JWT)

router.get('/token', basicAuthMiddleware, (req, res) => {
    jwt.sign(
        { user: { id: req.user._id, email: req.user.email } },           // payload
        jwtSecret,                    // secret
        { expiresIn: '1h' },          // expiración
        (err, token) => {
            if (err) {
                return res.status(500).json({ code: 'ER', message: 'Error generating token!' });
            }
            res.json({
                code: 'OK',
                message: 'Token generated successfully!',
                data: { token }
            });
        }
    );
});



// LOGIN CON SESIÓN

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ code: 'UA', message: 'Email and password are required!' });
    }

    User.loginUser(email, password, (err, user) => {
        if (err) return res.status(500).json({ code: 'ER', message: 'Error logging in!' });
        if (!user) return res.status(401).json({ code: 'UA', message: 'Email and password are invalid!' });

        // Guardar en sesión
        req.session.user = { id: user._id, email: user.email };

        res.json({
            code: 'OK',
            message: 'Login successfully!',
            data: { user: req.session.user }
        });
    });
});



// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ code: 'OK', message: 'Session closed!' });
});





    //Registro de usuario
    
router.post('/register', (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ code: 'VAL', message: 'Name, email and password are required!' });
        }

        User.getUserByEmail(email, (err, existingUser) => {
            if (err) return res.status(500).json({ code: 'ER', message: 'Error checking email!' });
            if (existingUser) return res.status(400).json({ code: 'EX', message: 'Email already exists!' });

            User.saveUser({ name, email, password }, (err, savedUser) => {
                if (err) return res.status(500).json({ code: 'ER', message: 'Error saving user!' });
                res.json({ code: 'OK', message: 'User created successfully!', data: { user: savedUser } });
            });
        });
    

});



// ✅ Ruta protegida para probar el token
const jwtAuthMiddleware = require('../middlewares/jwtAuth');
const sessionAuthMiddleware = require('../middlewares/session');

// Proteger esta ruta con JWT o sesión
router.get('/profile', sessionAuthMiddleware, (req, res) => {
  res.json({
    code: 'OK',
    message: 'Authenticated successfully!',
    data: req.user
  });
});




module.exports = router;
