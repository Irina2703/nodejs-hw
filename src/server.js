import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errors as celebrateErrors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(celebrateErrors());
app.use(errorHandler);

// Server start
const startServer = async () => {
    try {
        await connectMongoDB();
        app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();

export default app;
