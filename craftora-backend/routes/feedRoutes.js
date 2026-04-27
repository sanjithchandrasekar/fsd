const express = require('express');
const router  = express.Router();
const { getPosts, createPost, toggleLike } = require('../controllers/feedController');
const { protect } = require('../middleware/auth');
const { uploadFeed } = require('../middleware/upload');

router.get('/',            getPosts);
router.post('/',           protect, uploadFeed.array('images', 5), createPost);
router.post('/:id/like',   protect, toggleLike);

module.exports = router;
