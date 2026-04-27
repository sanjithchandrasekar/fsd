const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  image: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  isCustomOrder: { type: Boolean, default: false },
  customDetails: String,
});

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'dummy', 'cod'],
      default: 'stripe',
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'crafting', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
      default: 'placed',
    },
    trackingTimeline: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    estimatedDelivery: Date,
    trackingNumber: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
