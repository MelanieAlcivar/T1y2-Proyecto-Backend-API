require('dotenv').config();
const express = require('express');
const session = require ('express-session');
const mongoose = require('./db'); // tu conexión MongoDB
const performance = require('./middlewares/performance');

/* Controllers */
const eventsRouter = require('./controllers/events'); // ruta a tu router
const authsRouter = require('./controllers/auths')

const app = express();
const PORT = 3030;



/* Middleware */
app.use(express.json());
app.use(performance);

/* Logger */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, req.query);
  next();
});

//session
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true si usas HTTPS
}));



/* Health endpoint */
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = conectado
  res.status(200).json({
    status: dbState === 1 ? 'OK' : 'DOWN',
    uptime: process.uptime()
  });
});

/* Router principal */
app.use('/api/events', eventsRouter);
app.use('/api/v1/auths', authsRouter)

/* Error inesperado (500) */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 'ER', message: 'Internal Server Error' });
});

/* Iniciar servidor */
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
