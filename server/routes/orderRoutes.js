import express from 'express';
import {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order endpoints require authentication

// Customer routes
router.post('/', authorize('customer', 'admin'), createOrder);
router.get('/my-orders', getMyOrders);
router.put('/:id/cancel', cancelOrder);

// Vendor routes — MUST come before '/:id' to avoid param collision
router.get('/vendor-orders', authorize('vendor', 'admin'), getVendorOrders);
router.put('/:id/status', authorize('vendor', 'admin'), updateOrderStatus);

// Shared — get single order by ID
router.get('/:id', getOrderById);

export default router;
