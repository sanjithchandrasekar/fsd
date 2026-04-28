const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: {
      type: String,
      required: function () { return !this.googleId; },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: { type: String },
    avatar: {
      public_id: String,
      url: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },
    bio: { type: String, maxlength: 500 },
    artisanStory: { type: String, maxlength: 2000 },
    location: {
      city: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    isArtisan: { type: Boolean, default: false },
    artisanVideoUrl: { type: String },
    socialLinks: {
      instagram: String,
      facebook: String,
      website: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    sustainabilityScore: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Plain text password comparison (No security as requested)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
