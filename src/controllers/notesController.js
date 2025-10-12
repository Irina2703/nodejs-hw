const createHttpError = require('http-errors');
const Note = require('../models/note');

const getAllNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({});
        res.status(200).json(notes);
    } catch (err) { next(err); }
};

const getNoteById = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);
        if (!note) throw createHttpError(404, 'Note not found');
        res.status(200).json(note);
    } catch (err) { next(err); }
};

const createNote = async (req, res, next) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (err) { next(err); }
};

const updateNote = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const updated = await Note.findByIdAndUpdate(noteId, req.body, { new: true, runValidators: true });
        if (!updated) throw createHttpError(404, 'Note not found');
        res.status(200).json(updated);
    } catch (err) { next(err); }
};

const deleteNote = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const deleted = await Note.findByIdAndDelete(noteId);
        if (!deleted) throw createHttpError(404, 'Note not found');
        res.status(200).json(deleted);
    } catch (err) { next(err); }
};

module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
