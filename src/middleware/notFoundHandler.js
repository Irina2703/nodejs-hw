// src/middleware/notFoundHandler.js

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Route not found',
    });
};
