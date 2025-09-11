const express = require ('express');
const { body, param, query, validationResult } = require ('express-validator');
const { v4: uuidv4 } = require('uuid');



const app = express();
app.use (express.json());


// Puerto 3030
const PORT = 3030;

//Middleware de logging propio
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, req.query);
    next();
});


// Datos (walletfy)
let events = [{
    id: uuidv4(),
    name: 'Salario',
    description: 'Pago mensual',
    amount: 3000,
    date: '2023-10-01',
    type: 'income',
    attached: null
}];   



//Endpoint

app.get('/health', (req, res) => { 
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});


// GET
app.get('/api/events', [
    query ('page').optional().isInt({ min: 1 }),
    query ('limit').optional().isInt({ min:1})
], (req, res) => {
    
    const errors = validationResult(req);


    if (!errors.isEmpty()) return res.status(400).json({ code: 'BAD', errors: errors.array()});

    let { page = 1, limit = events.length } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const start = (page - 1) * limit;
    const end = start + limit;

    res.status(200).json ({ code: 'OK', message: 'Events listed successfully!', data: events.slice(start, end)});
});



// GET by ID
app.get('/api/events/:id', [
    param('id').isUUID().withMessage('Invalid ID')
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ code: 'BAD', errors: errors.array()}); 

    const event= events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ code: 'NF', message: 'Event not found'});

    res.status(200).json({ code: 'OK', message: 'Event found!', data: { event }});

});



// GET by query
app.get('/api/events/query', [
    query('id').isUUID().withMessage('Invalid ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ code: 'BAD', errors: errors.array() });

    const { id } = req.query;
    const event = events.find(e => e.id === id);
    if (!event) return res.status(404).json({ code: 'NF', message: 'Event not found!' });

    res.status(200).json({ code: 'OK', message: 'Event found!', data: { event } });
});




//POST

app.post('/api/events', [
    body('name').isString().notEmpty(),
    body('description').isString().optional(),
    body('amount').isNumeric(),
    body('date').isISO8601(),
    body('type').isIn(['income', 'expense']),
    body('attached').isString().optional()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ code: 'BAD', errors: errors.array()});

    const { name, description, amount, date, type, attached } = req.body;
    const newEvent = { id: uuidv4(), name, description, amount, date, type, attached: attached || null };

    events.push(newEvent);
    res.status(201).json({ code: 'OK', message: 'Event created successfully!', data: { event: newEvent} });
});




// PUT
 
app.put('/api/events/:id', [
    param('id').isUUID().withMessage('Invalid ID'),
    body('name').isString().notEmpty(),
    body('description').isString().optional(),
    body('amount').isNumeric(),
    body('date').isISO8601(),
    body('type').isIn(['income', 'expense']),
    body('attached').isString().optional()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ code: 'BAD', errors: errors.array()});

    const event = events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ code: 'NF', message: 'Event not found'});

    Object.assign(event, req.body);
    res.status(200).json({ code: 'OK', message: 'Event updated successfully!', data: { event } });
});




// DELETE
app.delete('/api/events/:id', [
    param('id').isUUID().withMessage('Invalid ID')
], (req, res) => {

    //validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ code: 'BAD', errors: errors.array()});

    //buscar evento
    const index = events.findIndex(e => e.id === req.params.id);

    //si no existe, devolver 404
    if (index === -1) return res.status(404).json({ code: 'NF', message: 'Event not found'});

    //eliminar y devolder evento eliminado
    const deleted = events.splice(index, 1);
    res.status(200).json({ code: 'OK', message: 'Event deleted successfully!', data: { event: deleted[0]} });
}); 


// Error inesperado (500)
app.use ((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ code: 'ERR', message: 'Internal Server Error' });
});


// Iniciar servidor (listen)
app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT}`);

});


