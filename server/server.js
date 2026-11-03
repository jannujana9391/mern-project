import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Attempt database connection
connectDB();

// Core Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for client application
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// GET /api/health - Endpoint to verify backend and database status
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected (Ready for Phase 3)',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'success',
    message: 'Multi-Vendor E-Commerce Backend API is active and healthy!',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      readyState: dbState,
    },
    services: {
      auth: 'Configured for Phase 4',
      products: 'Configured for Phase 7',
      orders: 'Configured for Phase 9',
    },
  });
});

// Root API Welcome route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Multi-Vendor E-Commerce REST API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
    },
  });
});

// Fallback 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Error] Server Exception:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server Listener
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Multi-Vendor E-Commerce API Server Started!`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

export default app;
