// src/validations/notesValidation.js
import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Валідація GET /notes
export const getAllNotesSchema = {
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        perPage: Joi.number().integer().min(5).max(20).default(10),
        tag: Joi.string().valid(...TAGS),
        search: Joi.string().allow(''),
    }),
};

// Валідація параметру noteId
const noteIdValidator = Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectId validation');

export const noteIdSchema = {
    [Segments.PARAMS]: Joi.object({
        noteId: noteIdValidator.required(),
    }),
};

// Валідація POST /notes
export const createNoteSchema = {
    [Segments.BODY]: Joi.object({
        title: Joi.string().min(1).required(),
        content: Joi.string().allow(''),
        tag: Joi.string().valid(...TAGS).required(),
    }),
};

// Валідація PATCH /notes/:noteId
export const updateNoteSchema = {
    [Segments.PARAMS]: noteIdSchema[Segments.PARAMS],
    [Segments.BODY]: Joi.object({
        title: Joi.string().min(1),
        content: Joi.string().allow(''),
        tag: Joi.string().valid(...TAGS),
    }),
};
