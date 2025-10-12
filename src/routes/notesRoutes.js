const express = require('express');
const router = express.Router();
const { getAllNotes, getNoteById, createNote, updateNote, deleteNote } = require('../controllers/notesController');

router.get('/', getAllNotes);
router.get('/:noteId', getNoteById);
router.post('/', createNote);
router.patch('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;
