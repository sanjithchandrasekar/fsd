const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc  Get all conversations for logged-in user
// @route GET /api/conversations
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar isVerified')
      .populate('productContext', 'title images')
      .sort({ lastMessageAt: -1 });
    res.json({ success: true, conversations });
  } catch (err) { next(err); }
};

// @desc  Get messages for a conversation
// @route GET /api/conversations/:id/messages
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) { next(err); }
};

// @desc  Send a message (creates conversation if needed)
// @route POST /api/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId, content, productId } = req.body;

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else {
      // Find existing or create new
      conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] }
      });
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, receiverId],
          productContext: productId || undefined,
        });
      }
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content,
    });

    // Update last message on conversation
    conversation.lastMessage   = content.slice(0, 80);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    await message.populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      message,
      conversationId: conversation._id,
    });
  } catch (err) { next(err); }
};
