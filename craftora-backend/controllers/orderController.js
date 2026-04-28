const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// @desc  Create order
// @route POST /api/orders
// @access Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify stock and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    if (product.stock < item.quantity) throw new Error(`Insufficient stock for: ${product.title}`);

    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.images[0]?.url || '',
      price: product.discountPrice || product.price,
      quantity: item.quantity,
      isCustomOrder: item.isCustomOrder || false,
      customDetails: item.customDetails,
    });

    subtotal += (product.discountPrice || product.price) * item.quantity;
  }

  const shippingCost = subtotal > 1000 ? 0 : 99;
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
  const totalAmount = subtotal + shippingCost + taxAmount;

  const order = await Order.create({
    buyer: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'dummy',
    subtotal,
    shippingCost,
    taxAmount,
    totalAmount,
    trackingTimeline: [{ status: 'placed', message: 'Order placed successfully' }],
  });

  // Deduct stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, totalSales: item.quantity } });
  }

  // Update seller totalSales
  const populated = await order.populate({ path: 'items.product', select: 'seller' });
  const sellerSales = {};
  for (const item of populated.items) {
    const sellerId = item.product?.seller?.toString();
    if (sellerId) sellerSales[sellerId] = (sellerSales[sellerId] || 0) + item.quantity;
  }
  for (const [sid, qty] of Object.entries(sellerSales)) {
    await User.findByIdAndUpdate(sid, { $inc: { totalSales: qty } });
  }

  res.status(201).json({ success: true, order });
});

// @desc  Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email')
    .populate('items.product', 'title images seller');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.buyer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json({ success: true, order });
});

// @desc  Get user's orders
// @route GET /api/orders/my-orders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.product', 'title images');

  res.json({ success: true, orders });
});

// @desc  Update order status (seller/admin)
// @route PUT /api/orders/:id/status
// @access Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, message } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;
  order.trackingTimeline.push({ status, message: message || `Order ${status}` });

  if (status === 'delivered') {
    order.isPaid = true;
    order.paidAt = Date.now();
  }

  await order.save();
  res.json({ success: true, order });
});

// @desc  Create Stripe payment intent
// @route POST /api/orders/create-payment-intent
// @access Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      metadata: { userId: req.user._id.toString() },
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400);
    throw new Error('Payment failed: ' + error.message);
  }
});

// @desc  Get all orders (admin)
// @route GET /api/orders/admin/all
// @access Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('buyer', 'name email')
    .populate('items.product', 'title');

  const total = await Order.countDocuments({});
  res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
});

module.exports = { createOrder, getOrder, getMyOrders, updateOrderStatus, createPaymentIntent, getAllOrders };
