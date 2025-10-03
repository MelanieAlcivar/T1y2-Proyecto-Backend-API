const { User } = require('../schemas/users');
module.exports.User = User;

// Buscar usuario por email
const getUserByEmail = (email, callback) => {
    User.findOne({ email })
        .then(user => callback(null, user))
        .catch(err => callback(err));
};

// Login: validar email y password
const loginUser = (email, password, callback) => {
    getUserByEmail(email, (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(null, null);

        // ⚠️ Compara password en plano (para Tarea 3 está bien)
        if (user.password !== password) return callback(null, null);

        callback(null, user);
    });
};

// Crear nuevo usuario
const saveUser = (userData, callback) => {
    const newUser = new User(userData);
    newUser.save()
        .then(saved => callback(null, saved))
        .catch(err => callback(err));
};

module.exports = {
    User,
    getUserByEmail,
    loginUser,
    saveUser
};
