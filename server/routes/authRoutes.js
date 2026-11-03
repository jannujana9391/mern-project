import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  seedDemoUsers,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/seed-demo', seedDemoUsers);

// Protected routes
router.get('/me', protect, getMe);

export default router;

