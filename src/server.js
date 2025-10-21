// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { errors } from 'celebrate';

import notesRouter from './routes/notesRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const PORT = process.env.PORT || 3030;
const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(logger);

// ===== Routes =====
app.use(notesRouter);

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
