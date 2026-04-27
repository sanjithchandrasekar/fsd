const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 2000 },
    mediaUrl: String,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const craftFeedSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, maxlength: 1000 },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    videoUrl: String,
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const customOrderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true, maxlength: 2000 },
    referenceImages: [String],
    budget: { type: Number },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    agreedPrice: Number,
    sellerNotes: String,
  },
  { timestamps: true }
);

module.exports = {
  Message: mongoose.model('Message', messageSchema),
  Conversation: mongoose.model('Conversation', conversationSchema),
  CraftFeed: mongoose.model('CraftFeed', craftFeedSchema),
  CustomOrder: mongoose.model('CustomOrder', customOrderSchema),
};
