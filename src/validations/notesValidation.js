import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// GET /notes
export const getAllNotesSchema = {
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        perPage: Joi.number().integer().min(5).max(20).default(10),
        tag: Joi.string().valid(...TAGS).optional(),
        search: Joi.string().allow(''),
    }),
};

// noteId param
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

// POST /notes
export const createNoteSchema = {
    [Segments.BODY]: Joi.object({
        title: Joi.string().min(1).required(),
        content: Joi.string().allow(''),
        tag: Joi.string().valid(...TAGS).optional(),
    }),
};

// PATCH /notes/:noteId
export const updateNoteSchema = {
    [Segments.PARAMS]: noteIdSchema[Segments.PARAMS],
    [Segments.BODY]: Joi.object({
        title: Joi.string().min(1),
        content: Joi.string().allow(''),
        tag: Joi.string().valid(...TAGS),
    }).min(1), // принаймні одне поле обов’язкове
};
