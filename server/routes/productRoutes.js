import express from 'express';
import {
  getProducts,
  getProductById,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);

// Vendor-specific routes (MUST be declared before /:id)
router.get('/vendor/my-products', protect, authorize('vendor', 'admin'), getVendorProducts);

// Single product details
router.get('/:id', getProductById);

// Protected vendor/admin mutation routes
router.post('/', protect, authorize('vendor', 'admin'), createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

export default router;
