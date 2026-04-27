const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { CraftFeed, CustomOrder, Conversation, Message } = require('../models/Social');

// ========================
// ADMIN CONTROLLER
// ========================

// @desc  Get dashboard analytics
// @route GET /api/admin/analytics
// @access Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers, totalSellers, totalProducts, totalOrders,
    pendingProducts, recentOrders, topSellers
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    User.countDocuments({ role: 'seller' }),
    Product.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments({ status: 'pending' }),
    Order.find({}).sort({ createdAt: -1 }).limit(5).populate('buyer', 'name'),
    User.find({ role: 'seller' }).sort({ totalSales: -1 }).limit(5).select('name avatar totalSales averageRating'),
  ]);

  const revenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers, totalSellers, totalProducts, totalOrders, pendingProducts,
      totalRevenue: revenue[0]?.total || 0,
    },
    recentOrders,
    topSellers,
    monthlySales,
  });
});

// @desc  Get all users
// @route GET /api/admin/users
// @access Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-password');
  const total = await User.countDocuments();
  res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
});

// @desc  Update user status
// @route PUT /api/admin/users/:id
// @access Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, select: '-password' }
  );
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

// @desc  Approve/reject product
// @route PUT /api/admin/products/:id/status
// @access Admin
const updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc  Get all products (admin)
// @route GET /api/admin/products
// @access Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const filter = status ? { status } : {};
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .populate('seller', 'name email')
    .limit(50);
  res.json({ success: true, products });
});

// ========================
// ARTISAN LEADERBOARD
// ========================
const getLeaderboard = asyncHandler(async (req, res) => {
  const artisans = await User.find({ role: 'seller', isActive: true })
    .sort({ totalSales: -1, averageRating: -1 })
    .limit(20)
    .select('name avatar bio totalSales averageRating totalRatings location isVerified');
  res.json({ success: true, artisans });
});

// ========================
// CRAFT FEED CONTROLLER
// ========================
const getFeed = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const posts = await CraftFeed.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * 10)
    .limit(10)
    .populate('author', 'name avatar isVerified')
    .populate('product', 'title price images');
  res.json({ success: true, posts });
});

const createFeedPost = asyncHandler(async (req, res) => {
  const { caption, tags, product } = req.body;
  const images = req.files ? req.files.map((f) => ({ public_id: f.filename, url: f.path })) : [];
  const post = await CraftFeed.create({
    author: req.user._id, caption,
    tags: tags ? JSON.parse(tags) : [],
    images, product,
  });
  const populated = await post.populate('author', 'name avatar');
  res.status(201).json({ success: true, post: populated });
});

const toggleLike = asyncHandler(async (req, res) => {
  const post = await CraftFeed.findById(req.params.id);
  if (!post) { res.status(404); throw new Error('Post not found'); }
  const idx = post.likes.indexOf(req.user._id);
  if (idx === -1) { post.likes.push(req.user._id); post.likesCount += 1; }
  else { post.likes.splice(idx, 1); post.likesCount -= 1; }
  await post.save();
  res.json({ success: true, likesCount: post.likesCount, liked: idx === -1 });
});

// ========================
// CUSTOM ORDER CONTROLLER
// ========================
const createCustomOrder = asyncHandler(async (req, res) => {
  const { seller, title, description, budget, deadline } = req.body;
  const customOrder = await CustomOrder.create({
    buyer: req.user._id, seller, title, description, budget,
    deadline: deadline ? new Date(deadline) : undefined,
  });
  res.status(201).json({ success: true, customOrder });
});

const getCustomOrders = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'seller'
    ? { seller: req.user._id }
    : { buyer: req.user._id };
  const orders = await CustomOrder.find(filter)
    .populate('buyer', 'name avatar')
    .populate('seller', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

const updateCustomOrder = asyncHandler(async (req, res) => {
  const order = await CustomOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, order });
});

// ========================
// CHAT / MESSAGING
// ========================
const getConversations = asyncHandler(async (req, res) => {
  const convs = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name avatar')
    .populate('product', 'title images')
    .sort({ lastMessageAt: -1 });
  res.json({ success: true, conversations: convs });
});

const getMessages = asyncHandler(async (req, res) => {
  const msgs = await Message.find({ conversation: req.params.convId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: 1 })
    .limit(100);
  res.json({ success: true, messages: msgs });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, receiverId, content, productId } = req.body;

  let conv = conversationId
    ? await Conversation.findById(conversationId)
    : await Conversation.findOne({ participants: { $all: [req.user._id, receiverId] } });

  if (!conv) {
    conv = await Conversation.create({
      participants: [req.user._id, receiverId],
      product: productId,
    });
  }

  const msg = await Message.create({
    conversation: conv._id,
    sender: req.user._id,
    content,
  });

  conv.lastMessage = content;
  conv.lastMessageAt = new Date();
  await conv.save();

  const populated = await msg.populate('sender', 'name avatar');
  res.status(201).json({ success: true, message: populated, conversationId: conv._id });
});

module.exports = {
  getAnalytics, getAllUsers, updateUser, updateProductStatus, getAllProducts,
  getLeaderboard, getFeed, createFeedPost, toggleLike,
  createCustomOrder, getCustomOrders, updateCustomOrder,
  getConversations, getMessages, sendMessage,
};
