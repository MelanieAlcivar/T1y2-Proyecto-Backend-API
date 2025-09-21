const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    attached: { type: String, default: null }, // puede ser URL o base64
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);