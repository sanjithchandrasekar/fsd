const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Helper: build query filters
const buildFilters = (query) => {
  const filter = { status: 'approved' };
  if (query.category) filter.category = query.category;
  if (query.isSustainable) filter.isSustainable = query.isSustainable === 'true';
  if (query.isCustomizable) filter.isCustomizable = true;
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.minRating) filter.averageRating = { $gte: Number(query.minRating) };
  return filter;
};

// @desc  Get all products (with filters, search, pagination)
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = buildFilters(req.query);

  // Text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Sorting
  let sort = { createdAt: -1 };
  if (req.query.sort === 'price_asc') sort = { price: 1 };
  else if (req.query.sort === 'price_desc') sort = { price: -1 };
  else if (req.query.sort === 'rating') sort = { averageRating: -1 };
  else if (req.query.sort === 'popular') sort = { totalSales: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name avatar isVerified location'),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single product
// @route GET /api/products/:id
// @access Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name avatar bio artisanStory isVerified location socialLinks totalSales averageRating artisanVideoUrl')
    .populate('reviews.user', 'name avatar');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Increment view count
  product.views += 1;
  await product.save();

  // Get related products
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: 'approved',
  })
    .limit(6)
    .populate('seller', 'name avatar');

  res.json({ success: true, product, related });
});

// @desc  Create product
// @route POST /api/products
// @access Private (Seller)
const createProduct = asyncHandler(async (req, res) => {
  const {
    title, description, story, price, discountPrice, category,
    tags, stock, isSustainable, sustainabilityDetails, materials,
    dimensions, weight, processingTime, isCustomizable, customizationDetails,
  } = req.body;

  const images = req.files
    ? req.files.map((f) => ({ public_id: f.filename, url: f.path }))
    : [];

  const product = await Product.create({
    title, description, story, price, discountPrice, category,
    tags: tags ? JSON.parse(tags) : [],
    stock, isSustainable, sustainabilityDetails,
    materials: materials ? JSON.parse(materials) : [],
    dimensions: dimensions ? JSON.parse(dimensions) : {},
    weight, processingTime, isCustomizable, customizationDetails,
    images,
    seller: req.user._id,
    status: req.user.role === 'admin' ? 'approved' : 'pending',
  });

  res.status(201).json({ success: true, product });
});

// @desc  Update product
// @route PUT /api/products/:id
// @access Private (Seller/Admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to edit this product');
  }

  // Handle new images
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({ public_id: f.filename, url: f.path }));
    product.images = [...product.images, ...newImages];
  }

  const fields = [
    'title', 'description', 'story', 'price', 'discountPrice', 'category',
    'stock', 'isSustainable', 'sustainabilityDetails', 'processingTime',
    'isCustomizable', 'customizationDetails', 'weight', 'videoUrl',
  ];
  fields.forEach((f) => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
  if (req.body.tags) product.tags = JSON.parse(req.body.tags);
  if (req.body.materials) product.materials = JSON.parse(req.body.materials);

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc  Delete product
// @route DELETE /api/products/:id
// @access Private (Seller/Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Delete images from Cloudinary
  for (const img of product.images) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// @desc  Add review
// @route POST /api/products/:id/reviews
// @access Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({ user: req.user._id, rating, comment });
  product.calculateAverageRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added', product });
});

// @desc  Get featured/trending products
// @route GET /api/products/featured
// @access Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const featured = await Product.find({ status: 'approved', featured: true })
    .limit(8)
    .populate('seller', 'name avatar');

  const trending = await Product.find({ status: 'approved' })
    .sort({ views: -1, totalSales: -1 })
    .limit(8)
    .populate('seller', 'name avatar');

  res.json({ success: true, featured, trending });
});

// @desc  Get seller's products
// @route GET /api/products/seller/:sellerId
// @access Public
const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    seller: req.params.sellerId,
    status: req.user?._id?.toString() === req.params.sellerId ? undefined : 'approved',
  }).populate('seller', 'name avatar');

  res.json({ success: true, products });
});

// @desc  Search autocomplete
// @route GET /api/products/search/suggestions
// @access Public
const searchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });

  const products = await Product.find({
    title: { $regex: q, $options: 'i' },
    status: 'approved',
  })
    .select('title category')
    .limit(8);

  const suggestions = products.map((p) => ({ label: p.title, category: p.category, id: p._id }));
  res.json({ success: true, suggestions });
});

module.exports = {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, addReview, getFeaturedProducts, getSellerProducts, searchSuggestions,
};
