import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import pino from 'pino-http';

const PORT = process.env.PORT || 3030;
const app = express();

app.use(express.json());
app.use(cors());
app.use(
    pino({
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
                messageFormat:
                    '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
                hideObject: true,
            },
        },
    }),
);

app.get('/test-error', () => {
    throw new Error('Simulated server error');
});

app.get('/notes', (req, res) => {
    res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
    const id_param = req.params.noteId;
    res.status(200).json({ message: `Retrieved note with ID: ${id_param}` });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error('Error', err.message);
    res.status(500).json({
        message: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`server is running on port  ${PORT}`);
});