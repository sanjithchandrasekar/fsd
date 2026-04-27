const express = require('express');
const router = express.Router();
const {
  getAnalytics, getAllUsers, updateUser, updateProductStatus, getAllProducts,
  getLeaderboard, getFeed, createFeedPost, toggleLike,
  createCustomOrder, getCustomOrders, updateCustomOrder,
  getConversations, getMessages, sendMessage,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadFeed } = require('../middleware/upload');

// Admin routes
router.get('/analytics', protect, adminOnly, getAnalytics);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id', protect, adminOnly, updateUser);
router.get('/products', protect, adminOnly, getAllProducts);
router.put('/products/:id/status', protect, adminOnly, updateProductStatus);

// Public/protected shared routes
router.get('/leaderboard', getLeaderboard);

// Craft Feed
router.get('/feed', getFeed);
router.post('/feed', protect, uploadFeed.array('images', 5), createFeedPost);
router.post('/feed/:id/like', protect, toggleLike);

// Custom Orders
router.post('/custom-orders', protect, createCustomOrder);
router.get('/custom-orders', protect, getCustomOrders);
router.put('/custom-orders/:id', protect, updateCustomOrder);

// Chat / Messaging
router.get('/conversations', protect, getConversations);
router.get('/conversations/:convId/messages', protect, getMessages);
router.post('/messages', protect, sendMessage);

module.exports = router;
