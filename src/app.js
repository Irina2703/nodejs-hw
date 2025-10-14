import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import notesRoutes from './routes/notesRoutes.js';
import createHttpError from 'http-errors';

dotenv.config();
const app = express();

app.use(express.json());

// Проста перевірка сервера на /
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Підключення маршруту нотаток
app.use('/notes', notesRoutes);

// Обробка 404 для всіх інших маршрутів
app.use((req, res, next) => next(createHttpError(404, 'Route not found')));

// Celebrate errors
app.use(errors());

// Глобальна обробка помилок
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

export default app;
