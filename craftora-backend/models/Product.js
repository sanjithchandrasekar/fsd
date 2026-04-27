const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
    images: [String],
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    story: {
      type: String,
      maxlength: 1500,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ['Jewelry', 'Pottery', 'Paintings', 'Decor', 'Textiles', 'Sculpture', 'Leather', 'Woodwork', 'Candles', 'Other'],
    },
    tags: [String],
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    videoUrl: { type: String },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stock: { type: Number, required: true, default: 1, min: 0 },
    isSustainable: { type: Boolean, default: false },
    sustainabilityDetails: { type: String },
    materials: [String],
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: { type: String, default: 'cm' },
    },
    weight: { type: Number },
    processingTime: { type: String, default: '3-5 business days' },
    isCustomizable: { type: Boolean, default: false },
    customizationDetails: { type: String },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'pending',
    },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    location: { type: String },
  },
  { timestamps: true }
);

// Calculate average rating when reviews change
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
    return;
  }
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  this.numReviews = this.reviews.length;
};

// Text index for search
productSchema.index({ title: 'text', description: 'text', tags: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
