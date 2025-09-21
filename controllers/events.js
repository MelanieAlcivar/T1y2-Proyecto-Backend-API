const router = require('express').Router();
const { body, query, validationResult} = require('express-validator');

/*Models*/
const Events = require('../../models/Events');



//Entity: Events
//GET ALL EVENTS (con paginación y filtros)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, type, sortBy ="date", order = "desc" } = req.query; 

        const filters = { deleted: false };
        if (type) {
            filters.type = type;
        }

        const events = await Events.find(filters)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Events.countDocuments(filters);

        res.json({
            code: 'OK',
            message: 'Events retrieved successfully!',
            data: {
                page: Number(page),
                totalPages: Math.ceil(total / limit),
                total,
                events,
            },
        });
    } catch (err) {
        res.status(500).json({ code: 'ER', message: 'Error retrieving events!', error: err.message});
        }
    });




//GET EVENT BY ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.deleted) {
      return res.status(404).json({ code: "NF", message: "Event not found!" });
    }
    res.json({ code: "OK", message: "Event found!", data: { event } });
  } catch (err) {
    res.status(400).json({ code: "PF", message: "Invalid ID format!" });
  }
});




//POST - CREATE EVENT
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({
      code: "OK",
      message: "Event created successfully!",
      data: { event: newEvent },
    });
  } catch (err) {
    res.status(400).json({ code: "ER", message: "Error creating event!", error: err.message });
  }
});




//PUT - UPDATE EVENT
router.put('/:id', async (req, res) => {
    try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ code: "NF", message: "Event not found!" });
    }
    res.json({ code: "OK", message: "Event updated successfully!", data: { event: updatedEvent } });
  } catch (err) {
    res.status(400).json({ code: "ER", message: "Error updating event!", error: err.message });
  }
});

    



//DELETE

/*router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log('DELETE /events/:id:',id);
    const event = users.find(event => event.id == id);
    if (event) {
        events = events.filter(event => event.id != id);
        return res.json({ code: 'OK', message: 'Event deleted!', data: { event}})
    }
    res.status(404).json({ code: 'PF', message: 'Event not found!'});
});*/

router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deletedEvent) {
      return res.status(404).json({ code: "NF", message: "Event not found!" });
    }
    res.json({ code: "OK", message: "Event deleted (logical)!", data: { event: deletedEvent } });
  } catch (err) {
    res.status(400).json({ code: "PF", message: "Invalid ID format!" });
  }
});



module.exports = router;