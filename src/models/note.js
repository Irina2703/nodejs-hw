import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    tag: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text' });

export const Note = mongoose.model('Note', noteSchema);
