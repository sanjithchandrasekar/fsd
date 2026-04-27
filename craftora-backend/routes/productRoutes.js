const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, addReview, getFeaturedProducts, getSellerProducts, searchSuggestions,
} = require('../controllers/productController');
const { protect, sellerOrAdmin } = require('../middleware/auth');
const { uploadProduct } = require('../middleware/upload');

router.get('/featured', getFeaturedProducts);
router.get('/search/suggestions', searchSuggestions);
router.get('/seller/:sellerId', protect, getSellerProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, sellerOrAdmin, uploadProduct.array('images', 8), createProduct);
router.put('/:id', protect, sellerOrAdmin, uploadProduct.array('images', 8), updateProduct);
router.delete('/:id', protect, sellerOrAdmin, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
