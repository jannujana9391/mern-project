import express from 'express';
import {
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  updateVendorStatus,
} from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Vendor profile routes
router.get('/profile', authorize('vendor'), getVendorProfile);
router.put('/profile', authorize('vendor'), updateVendorProfile);

// Admin-only routes
router.get('/all', authorize('admin'), getAllVendors);
router.put('/:id/status', authorize('admin'), updateVendorStatus);

export default router;

