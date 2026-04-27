const express = require('express');
const router = express.Router();
const {
  createOrder, getOrder, getMyOrders, updateOrderStatus, createPaymentIntent, getAllOrders,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
