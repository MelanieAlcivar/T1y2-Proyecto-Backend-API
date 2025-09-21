const router = require('express').Router();
const { body, param, query, validationResult} = require('express-validator');

/*Models*/
const Events = require('../models/events');

/* Validar errores */
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ code: 'VAL', errors: errors.array() });
        return true; // hubo error
    }
    return false;
};


/*Validaciones*/
const validateEventCreate = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('description').isString().withMessage('La descripción debe ser texto'),
    body('amount').isNumeric().withMessage('El monto debe ser numérico'),
    body('date').isISO8601().withMessage('La fecha debe estar en formato YYYY-MM-DD'),
    body('type').isIn(['income', 'expense']).withMessage('El tipo debe ser income o expense'),
    body('attached').optional().isString().withMessage('El campo attached debe ser texto')
];

const validateEventUpdate = [
    param('id').isMongoId().withMessage('ID inválido'),
    body('name').optional().notEmpty(),
    body('description').optional().isString(),
    body('amount').optional().isNumeric(),
    body('date').optional().isISO8601(),
    body('type').optional().isIn(['income', 'expense']),
    body('attached').optional().isString()
];

const validateEventId = [
    param('id').isMongoId().withMessage('ID inválido')
];

const validateEventQuery = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page debe ser un número >=1'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit debe ser un número >=1'),
    query('type').optional().isIn(['income', 'expense']).withMessage('Type inválido'),
    query('sortBy').optional().isIn(['date', 'amount', 'name']).withMessage('sortBy inválido')
];



// Get/api/events
router.get ('/', validateEventQuery, (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { page = 1, limit = 5, type, sortBy ='date' } = req.query;
  const filter = type ? { type } : {};

  Events.getAllEvent((err, events) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error retrieving events!' });

    // Filtrado por tipo
    let filtered =events;
    if (type) filtered = events.filter(e => e.type === type);

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'date' ) return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount') return a.amount - b.amount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    // Paginación
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + Number(limit));

    res.json ({
      code: 'OK',
      message: 'Events retrieved successfully!',
      data: {
        events: paginated,
        total: filtered.length,
        page: Number(page),
        limit: Number(limit)
      }
      
    });
  });
});



// Get/api/events/:id
router.get ('/:id', validateEventId, (req, res) => {
  if (handleValidationErrors (req, res)) return;

  Events.getEventById(req.params.id, (err, event) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error retrieving event!' });
    if (!event) return res.status(404).json ({ code: 'NF', message: 'Event not found!'});
    
    res.json({ code: 'OK', message: 'Event retrieved successfully!', data: { event } });
  });
});


// Post/api/events
router.post ('/', validateEventCreate, (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { name, description, amount, date, type, attached } = req.body;
  const newEvent = { name, description, amount, date, type, attached: attached || null };

  Events.saveEvent(newEvent, (err, saved) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error saving event!' });
    res.json({ code: 'OK', message: 'Event saved successfully!', data: { event: saved } });
  });
});



// Put/api/events/:id
router.put ('/:id', validateEventUpdate, (req, res) => {
  if (handleValidationErrors(req, res)) return;

  Events.updateEvent(req.params.id, req.body, (err, updated) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error updating event!' });
    if (!updated) return res.status(404).json({ code: 'NF', message: 'Event not found!' });

    res.json ({ code:'OK', message: 'Event updated successfully!', data: { event: updated } });
  });
});

// Delete/api/events/:id
router.delete ('/:id', validateEventId, (req, res) => {
  if (handleValidationErrors(req, res)) return;

  Events.deleteEvent(req.params.id, (err, deleted) => {
    if (err) return res.status(500).json({ code: 'ER', message: 'Error deleting event!' });
    if (!deleted) return res.status(404).json({ code: 'NF', message: 'Event not found!' });

    res.json({ code:'OK', message: 'Event deleted successfully!', data: { event: deleted } });
  });
});

module.exports = router;
