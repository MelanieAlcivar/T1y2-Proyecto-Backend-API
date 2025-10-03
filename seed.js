require('dotenv').config();
const mongoose = require('mongoose');
const {User} = require('./models/users'); // ruta a tu modelo

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
    console.log('Conectado a MongoDB');

    // Crear usuario de prueba
    const user = await User.create({ 
        name: 'Melanie', 
        email: 'melanie@hotmail.com', 
        password: '123456' // si no estás usando hashing aún
    });

    console.log('Usuario creado:', user);
    process.exit();
})
.catch(err => console.log(err));
