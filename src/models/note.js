// src/models/note.js
import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js'; // 🔥 додано з розширенням .js

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },   // 🔥 додано trim
        content: { type: String, required: true, trim: true }, // 🔥 required + trim
        tag: {
            type: String,
            enum: TAGS,           // 🔥 перевірка через TAGS
            default: 'Todo',      // 🔥 опціональне поле
            required: false
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    { timestamps: true }
);

noteSchema.index({ title: 'text', content: 'text' });

export const Note = mongoose.model('Note', noteSchema);
