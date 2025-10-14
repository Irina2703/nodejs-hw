import express from 'express';
import { celebrate } from 'celebrate';
import Note from '../models/note.js';
import {
    getAllNotesSchema,
    noteIdSchema,
    createNoteSchema,
    updateNoteSchema
} from '../validations/notesValidation.js';
import createHttpError from 'http-errors';

const router = express.Router();

/**
 * GET /notes — з пошуком, фільтрацією і пагінацією
 */
router.get('/', celebrate(getAllNotesSchema), async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, tag, search } = req.query;
        const filter = {};

        if (tag) filter.tag = tag;
        if (search) filter.$text = { $search: search };

        const totalNotes = await Note.countDocuments(filter);
        const notes = await Note.find(filter)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

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
});

/**
 * GET /notes/:noteId — отримати одну нотатку
 */
router.get('/:noteId', celebrate(noteIdSchema), async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) throw createHttpError(404, 'Note not found');
        res.json(note);
    } catch (err) {
        next(err);
    }
});

/**
 * POST /notes — створити нову нотатку
 */
router.post('/', celebrate(createNoteSchema), async (req, res, next) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (err) {
        next(err);
    }
});

/**
 * PATCH /notes/:noteId — оновити нотатку
 */
router.patch('/:noteId', celebrate(updateNoteSchema), async (req, res, next) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.noteId, req.body, { new: true });
        if (!updatedNote) throw createHttpError(404, 'Note not found');
        res.json(updatedNote);
    } catch (err) {
        next(err);
    }
});

/**
 * DELETE /notes/:noteId — видалити нотатку
 */
router.delete('/:noteId', celebrate(noteIdSchema), async (req, res, next) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.noteId);
        if (!deletedNote) throw createHttpError(404, 'Note not found');
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

export default router;
