const jwtAuthMiddleware = require('./jwtAuth');

module.exports = (req, res, next) => {
    // 1️⃣ Si hay Authorization, usamos JWT
    if (req.headers.authorization) {
        return jwtAuthMiddleware(req, res, next);
    }

    // 2️⃣ Si no hay Authorization, revisamos sesión
    const user = req.session?.user;
    if (!user) {
        return res.status(401).json({ code: 'UA', message: 'User not logged in!' });
    }

    // 3️⃣ Usuario encontrado en sesión → continuar
    req.user = user;
    next();
};
