import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import notesRoutes from './routes/notesRoutes.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

// ✅ маршрути
app.use(notesRoutes);


app.use(errors());


app.use(notFoundHandler);


app.use(errorHandler);

export default app;
