require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectMongoDB = require('./db/connectMongoDB');
const notesRoutes = require('./routes/notesRoutes');

const logger = require('./middleware/logger');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

app.use('/notes', notesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
    if (!MONGO_URL) {
        console.error('MONGO_URL is not defined');
        process.exit(1);
    }

    try {
        await connectMongoDB(MONGO_URL);
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

start();
