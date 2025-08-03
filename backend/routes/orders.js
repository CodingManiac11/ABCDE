const express = require('express');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orders');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes
router.route('/')
  .post(protect, createOrder)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Admin routes
router
  .route('/:id/deliver')
  .put(protect, authorize('admin'), updateOrderToDelivered);

router
  .route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
