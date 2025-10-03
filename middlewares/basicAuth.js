const Users = require("../models/users");

const basicAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Validar que venga el header Authorization
    if (!authHeader) {
        return res.status(401).json({ code: 'UA', message: 'Authorization header is required!' });
    }

    // Extraer tipo y credenciales
    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic' || !credentials) {
        return res.status(401).json({ code: 'UA', message: 'Authorization type is not supported!' });
    }

    console.log('credentials Base64:', credentials);

    // Decodificar credenciales base64 → "email:password"
    const rawCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    console.log('credentials utf-8:', rawCredentials);

    const [email, password] = rawCredentials.split(':');
    console.log('email:', email);
    console.log('password:', password);

    if (!email || !password) {
        return res.status(401).json({ code: 'UA', message: 'Username and password are required!' });
    }

    // Buscar usuario en la base de datos
    return Users.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error getting user by email and password!' });
        }
        if (!user) {
            return res.status(401).json({ code: 'UA', message: 'Email and password are invalid!' });
        }

        // Comparar contraseña
        if (user.password !== password) {
            return res.status(401).json({ code: 'UA', message: 'Email and password are invalid!' });
        }

        
        req.user = user;
        next();
    });
};

module.exports = basicAuthMiddleware;
