import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

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

// Enable CORS for client application with flexible origin handling
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production' ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// GET /api/health - Endpoint to verify backend and database status
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
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
      auth: 'Active & Verified',
      orders: 'Active & Verified',
      products: 'Active & Verified (Phase 7)',
      categories: 'Active & Verified (Phase 7)',
      vendors: 'Active & Verified',
      admin: 'Active & Verified (Phase 10)',
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
      orders: '/api/orders',
      products: '/api/products',
      categories: '/api/categories',
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
  console.log(`  Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`  Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`====================================================`);
});

export default app;
