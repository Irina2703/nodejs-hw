const mongoose = require('mongoose');

const ALLOWED_TAGS = [
    'Work', 'Personal', 'Meeting', 'Shopping',
    'Ideas', 'Travel', 'Finance', 'Health',
    'Important', 'Todo'
];

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: { type: String, enum: ALLOWED_TAGS, default: 'Todo' }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
