import express from 'express';
import {
  getPlatformStats,
  getAllUsers,
  toggleUserBlock,
  getAllOrdersAdmin,
  updateVendorCommission,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleUserBlock);
router.get('/orders', getAllOrdersAdmin);
router.put('/vendors/:id/commission', updateVendorCommission);

export default router;
