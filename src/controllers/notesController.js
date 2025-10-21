// src/controllers/notesController.js
const Note = require('../models/note');
const createHttpError = require('http-errors');

async function getAllNotes(req, res, next) {
    try {
        const { page = 1, perPage = 10, tag, search } = req.query;
        const query = { userId: req.user._id };

        if (tag) query.tag = tag;
        if (search) query.$text = { $search: search };

        const pageNumber = Number(page) || 1;
        const perPageNumber = Number(perPage) || 10;

        const totalNotes = await Note.countDocuments(query);
        const totalPages = Math.ceil(totalNotes / perPageNumber);

        const notes = await Note.find(query)
            .skip((pageNumber - 1) * perPageNumber)
            .limit(perPageNumber);

        res.status(200).json({
            page: pageNumber,
            perPage: perPageNumber,
            totalNotes,
            totalPages,
            notes
        });
    } catch (err) {
        next(createHttpError(500, err.message));
    }
}

module.exports = { getAllNotes };
