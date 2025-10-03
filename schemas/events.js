const mongoose = require('mongoose');
const {Result} = require('express-validator');


const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    attached: {
        type: String,
        required: false,
        default: null // puede ser URL o base64
    },
});

const Event = mongoose.model('Event', eventSchema);


// Create and save a new event
const saveEvent = (event, callback) => {
    const { id, name, description, amount, date, typem, attached } = event;
    const newEvent = new Event({ id, name, description, amount, date, type, attached });
    newEvent.save()
    .then(() => {
        console.log('✅nuevo evento creado!')
        return callback (null, newUser);
    })
    .catch(err => {
        console.error('Mongodb error:', err);
        return callback(err);
    });
};



// Encontrar
const findAllEvents = (callback) => {
    Event.find()
        .then(results => {
            console.log('📝 Todos los eventos:', results);
            return callback(null, results);
        })
        .catch(err => {
            console.error(err);
            return callback(err);
        });
};

// Encontrar por ID
const findEventById = (id, callback) => {
    Event.findOne({ id })
        .then(result => {
            console.log('🔎 Evento encontrado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error('Error:', err);
            return callback(err);
        });
};


// Actualizar por ID
const updateEvent = (id, event, callback) => {
    Event.findOneAndUpdate({ id }, event, { new: true })
        .then(result => {
            console.log('✏️ Evento actualizado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error(err);
            return callback(err);
        });
};


// Eliminar por ID
const deleteEvent = (id, callback) => {
    Event.findOneAndDelete({ id })
        .then(result => {
            console.log('🗑️ Evento eliminado:', result);
            return callback(null, result);
        })
        .catch(err => {
            console.error(err);
            return callback(err);
        });
};

module.exports = {
    Event,
    saveEvent,
    findAllEvents,
    findEventById,
    updateEvent,
    deleteEvent
};