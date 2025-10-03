const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ code: 'UA', message: 'Authorization header is required!' });
    }

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
        return res.status(401).json({ code: 'UA', message: 'Authorization type is not supported!' });
    }

    return jwt.verify(token, jwtSecret, (error, user) => {
        if (error) {
            return res.status(401).json({ code: 'UA', message: 'Invalid token!' });
        }

        console.log('✅ User decoded from JWT:', user);
        req.user = user; // Guardamos al usuario dentro del request
        next();
    });
};
