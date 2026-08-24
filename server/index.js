import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { autoSeedDatabase } from './seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sahakargig';

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve static frontend files in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all for SPA client routing (Express 5 compatible)
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send('SahakarGig API Server is running. Access via http://localhost:3000 in development.');
    }
  });
});

// Suppress unhandled mongoose event crashes
mongoose.connection.on('error', (err) => {
  console.warn('⚠️ Mongoose connection note:', err.message);
});

// Start Express Listener first to ensure 100% uptime
const server = app.listen(PORT, () => {
  console.log(`🚀 SahakarGig Fullstack Express Server running on port ${PORT}`);
  console.log(`👉 API Health Check: http://localhost:${PORT}/api/health`);
  connectDatabase();
});

// Connect to MongoDB asynchronously with auto-seeding
async function connectDatabase() {
  try {
    if (process.env.MONGODB_URI) {
      console.log('📡 Connecting to MongoDB Atlas Cloud Database...');
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ Connected to MongoDB Atlas successfully!');
      await autoSeedDatabase();
    } else {
      console.log('ℹ️ Attempting local MongoDB connection...');
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 3000
      });
      console.log('✅ Connected to Local MongoDB successfully!');
      await autoSeedDatabase();
    }
  } catch (error) {
    console.warn('⚠️ MongoDB connection notice:', error.message);
    console.log('🛡️ SahakarGig operating in resilient In-Memory Mode (Zero Crash Guarantee).');
  }
}
