// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errors } from 'celebrate';
import notesRouter from './routes/notesRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3030;
const app = express();

// ===== Middleware =====
app.use(morgan('dev'));
app.use(express.json());

// ===== Routes =====
app.use('/notes', notesRouter);

// ===== Celebrate errors =====
app.use(errors());

// ===== Custom error handlers =====
app.use(notFoundHandler);
app.use(errorHandler);

// ===== Start server after DB connection =====
async function startServer() {
    try {
        await connectMongoDB();
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
}

startServer();
