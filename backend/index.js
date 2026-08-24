import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { seedDatabaseIfEmpty } from './seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'SahakarGig Cooperative API Engine',
    version: '1.0.0',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas (AWS Mumbai Connected)' : 'In-Memory Telemetry',
    endpoints: {
      health: '/api/health',
      workers: '/api/workers',
      services: '/api/services',
      bookings: '/api/bookings',
      proposals: '/api/proposals',
      disputes: '/api/disputes',
      aiChat: '/api/ai/chat'
    }
  });
});

// Start Server & Connect MongoDB Atlas
async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB Atlas (Cluster0 AWS Mumbai)...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000
      });
      console.log('MongoDB Atlas Connected Successfully!');
      await seedDatabaseIfEmpty();
    } catch (err) {
      console.error('MongoDB Atlas connection failed:', err.message);
      console.log('Running in Resilient In-Memory Mode.');
    }
  } else {
    console.log('No MONGODB_URI found. Running in In-Memory Mode.');
  }

  app.listen(PORT, () => {
    console.log(`SahakarGig Backend Server running on http://localhost:${PORT}`);
  });
}

startServer();
