import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for client
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Multi-Vendor E-Commerce Backend API is active and healthy!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Root API Welcome route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Multi-Vendor E-Commerce API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth (Phase 4)',
      products: '/api/products (Phase 7)',
      categories: '/api/categories (Phase 7)',
      orders: '/api/orders (Phase 9)',
    },
  });
});

// Fallback for 404 routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Multi-Vendor E-Commerce Server running!`);
  console.log(` Port: ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health URL: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
