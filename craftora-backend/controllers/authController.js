const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc  Register user
// @route POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, role: role || 'buyer' });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account is suspended. Contact support.');
  }

  user.lastSeen = Date.now();
  await user.save();

  res.json({
    success: true,
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
});

// @desc  Get current user profile
// @route GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title images price averageRating');
  res.json({ success: true, user });
});

// @desc  Update profile
// @route PUT /api/auth/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, artisanStory, location, socialLinks, artisanVideoUrl } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (artisanStory) user.artisanStory = artisanStory;
  if (location) user.location = location;
  if (socialLinks) user.socialLinks = socialLinks;
  if (artisanVideoUrl) user.artisanVideoUrl = artisanVideoUrl;

  if (req.file) {
    user.avatar = { public_id: req.file.filename, url: req.file.path };
  }

  const updated = await user.save();
  res.json({ success: true, user: sanitizeUser(updated) });
});

// @desc  Toggle wishlist
// @route POST /api/auth/wishlist/:productId
// @access Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid = req.params.productId;

  const index = user.wishlist.indexOf(pid);
  let action;
  if (index === -1) {
    user.wishlist.push(pid);
    action = 'added';
  } else {
    user.wishlist.splice(index, 1);
    action = 'removed';
  }

  await user.save();
  res.json({ success: true, action, wishlist: user.wishlist });
});

// @desc  Become a seller
// @route POST /api/auth/become-seller
// @access Private
const becomeSeller = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role === 'seller') {
    res.status(400);
    throw new Error('You are already a seller');
  }
  user.role = 'seller';
  user.isArtisan = true;
  await user.save();
  res.json({ success: true, message: 'Congratulations! You are now a seller.', user: sanitizeUser(user) });
});

// Helper: sanitize user object
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  isArtisan: user.isArtisan,
  artisanStory: user.artisanStory,
  location: user.location,
  socialLinks: user.socialLinks,
  wishlist: user.wishlist,
  totalSales: user.totalSales,
  averageRating: user.averageRating,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});

module.exports = { register, login, getMe, updateProfile, toggleWishlist, becomeSeller };
