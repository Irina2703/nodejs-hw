// У файлі models/noteModel.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    tag: String,
}, { timestamps: true });

// Створення текстового індексу для пошуку по title та content
noteSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Note', noteSchema);
