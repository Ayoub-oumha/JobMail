import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import connectDB from './config/db.js';
import initScheduler from './services/scheduler.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

// Path resolution for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', server_time: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    initScheduler();
});
