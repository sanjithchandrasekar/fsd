const FeedPost = require('../models/FeedPost');
const cloudinary = require('../config/cloudinary');

// @desc  Get all feed posts (paginated)
// @route GET /api/feed
exports.getPosts = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const posts = await FeedPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar isVerified')
      .populate('product', '_id title images price');

    const total = await FeedPost.countDocuments();

    res.json({ success: true, posts, pagination: { total, page, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
};

// @desc  Create a feed post
// @route POST /api/feed
exports.createPost = async (req, res, next) => {
  try {
    const { caption, tags, productId } = req.body;
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        images.push({ url: file.path, publicId: file.filename });
      }
    }

    const post = await FeedPost.create({
      author: req.user._id,
      caption,
      images,
      product: productId || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });

    await post.populate('author', 'name avatar isVerified');
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// @desc  Toggle like on a post
// @route POST /api/feed/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await FeedPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const userId  = req.user._id.toString();
    const liked   = post.likes.map(l => l.toString()).includes(userId);

    if (liked) {
      post.likes    = post.likes.filter(l => l.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }
    post.likesCount = post.likes.length;
    await post.save();

    res.json({ success: true, liked: !liked, likesCount: post.likesCount });
  } catch (err) {
    next(err);
  }
};
