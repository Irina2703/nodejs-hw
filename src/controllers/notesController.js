// src/controllers/notesController.js
import Note from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, tag, search } = req.query;
        const skip = (page - 1) * perPage;

        let query = Note.find();

        if (tag) query = query.where('tag').equals(tag);
        if (search) query = query.where({ $text: { $search: search } });

        const countQuery = Note.countDocuments(query.getFilter());

        const [totalNotes, notes] = await Promise.all([
            countQuery,
            query.skip(skip).limit(Number(perPage)),
        ]);

        res.status(200).json({
            page: Number(page),
            perPage: Number(perPage),
            totalNotes,
            totalPages: Math.ceil(totalNotes / perPage),
            notes,
        });
    } catch (err) {
        next(err);
    }
};

export const getNoteById = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) throw createHttpError(404, 'Note not found');
        res.json(note);
    } catch (err) {
        next(err);
    }
};

export const createNote = async (req, res, next) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (err) {
        next(err);
    }
};

export const updateNote = async (req, res, next) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
            new: true,
        });
        if (!updatedNote) throw createHttpError(404, 'Note not found');
        res.json(updatedNote);
    } catch (err) {
        next(err);
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.noteId);
        if (!deletedNote) throw createHttpError(404, 'Note not found');
        res.status(200).json(deletedNote);
    } catch (err) {
        next(err);
    }
};
