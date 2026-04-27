const express = require('express');
const router = express.Router();
const {
  register, login, getMe, updateProfile, toggleWishlist, becomeSeller,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadAvatar.single('avatar'), updateProfile);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/become-seller', protect, becomeSeller);

module.exports = router;
