const express = require('express');
const mongoose = require('./db'); // tu conexión MongoDB
const performance = require('./middlewares/performance');

/* Controllers */
const eventsRouter = require('./controllers/events'); // ruta a tu router

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

/* Error inesperado (500) */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ code: 'ERR', message: 'Internal Server Error' });
});

/* Iniciar servidor */
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
