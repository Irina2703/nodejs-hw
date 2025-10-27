import createHttpError from 'http-errors';

/**
 * Middleware для перевірки тіла запиту згідно зі схемою Joi.
 * Якщо дані не валідні — повертає 400 помилку.
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return next(createHttpError(400, error.message));
        }

        next();
    };
};

export default validateBody;
