const Event = require('../schemas/event');



const getAllEvent = (callback) => {
    Event.Event.find()
        .then(results => callback(null, results))
        .catch(err => callback(err));
};


const getEventById = (id, callback) => {
   Event.Event.findById(id)
        .then(result => callback(null, result))
        .catch(err => callback(err));
};


const saveEvent = (user, callback) => {
    const newEvent = new Event.Event(eventData);
    newEvent.save()
        .then(saved => callback(null, saved))
        .catch(err => callback(err));
};


const updateEvent = (id, eventData, callback) => {
    Event.Event.findByIdAndUpdate(id, eventData, { new: true })
        .then(updated => callback(null, updated))
        .catch(err => callback(err));
};


const deleteEvent = (id, callback) => {
    Event.Event.findByIdAndDelete(id)
        .then(deleted => callback(null, deleted))
        .catch(err => callback(err));
};

module.exports = {
    getAllEvent,
    getEventById,
    saveEvent,
    updateEvent,
    deleteEvent
}