// src/controllers/notesController.js
import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const createNote = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user._id;

        const note = await Note.create({ title, content, tags, userId });
        res.status(201).json(note);
    } catch (err) {
        next(err);
    }
};

export const getAllNotes = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, tags, search } = req.query;
        const userId = req.user._id;

        const filter = { userId };
        if (tags) filter.tags = tags;
        if (search) filter.$text = { $search: search };

        // ✅ Виконуємо одночасно через Promise.all
        const [notes, totalNotes] = await Promise.all([
            Note.find(filter)
                .skip((page - 1) * perPage)
                .limit(Number(perPage)),
            Note.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalNotes / perPage);

        res.status(200).json({
            page: Number(page),
            perPage: Number(perPage),
            totalNotes,
            totalPages,
            notes,
        });
    } catch (err) {
        next(err);
    }
};

export const getNoteById = async (req, res, next) => {
    try {
        const note = await Note.findOne({
            _id: req.params.noteId,
            userId: req.user._id,
        });
        if (!note) throw createHttpError(404, 'Note not found');
        res.json(note);
    } catch (err) {
        next(err);
    }
};

export const updateNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.noteId, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!note) throw createHttpError(404, 'Note not found');
        res.json(note);
    } catch (err) {
        next(err);
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.noteId,
            userId: req.user._id,
        });
        if (!note) throw createHttpError(404, 'Note not found');
        res.status(200).json(note);
    } catch (err) {
        next(err);
    }
};
