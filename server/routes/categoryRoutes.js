import express from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: list all categories
router.get('/', getCategories);

// Protected route: create new category
router.post('/', protect, authorize('admin', 'vendor'), createCategory);

export default router;

