// src/middlewares/errorHandlers.js

// 404 — коли маршрут не знайдено
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Route not found',
    });
};

// Загальний обробник помилок
export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.message);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        status: 'error',
        code: status,
        message,
    });
};
