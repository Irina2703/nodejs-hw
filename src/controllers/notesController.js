import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const createNote = async (req, res, next) => {
    try {
        const { title, content, tag } = req.body;
        const userId = req.user._id;

        const note = await Note.create({ title, content, tag, userId });
        res.status(201).json(note);
    } catch (err) {
        next(err);
    }
};

export const getAllNotes = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, tag, search } = req.query;
        const userId = req.user._id;

        let query = Note.find().where('userId').equals(userId);

        if (tag) query = query.where('tag').equals(tag);
        if (search) query = query.find({ $text: { $search: search } });

        const [notes, totalNotes] = await Promise.all([
            query.skip((page - 1) * perPage).limit(Number(perPage)),
            Note.countDocuments(query.getQuery()),
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
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
