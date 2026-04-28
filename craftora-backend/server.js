require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const feedRoutes = require('./routes/feedRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Connect to MongoDB
connectDB().catch(err => console.error('Initial DB Connection Error:', err));

const app = express();
app.get('/api/ping', (req, res) => res.send('pong'));

// --- ONLY RUN SOCKET.IO LOCALLY ---
if (process.env.NODE_ENV !== 'production') {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);
    socket.on('user:online', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
    socket.on('conversation:join', (conversationId) => socket.join(conversationId));
    socket.on('message:send', (data) => io.to(data.conversationId).emit('message:receive', data));
    socket.on('typing:start', (data) => socket.to(data.conversationId).emit('typing:start', { userId: data.userId }));
    socket.on('typing:stop', (data) => socket.to(data.conversationId).emit('typing:stop', { userId: data.userId }));
    socket.on('order:update', (data) => {
      const recipientSocket = onlineUsers.get(data.userId);
      if (recipientSocket) io.to(recipientSocket).emit('order:status_changed', data);
    });
    socket.on('disconnect', () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(uid);
          break;
        }
      }
      io.emit('users:online', Array.from(onlineUsers.keys()));
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`\n🚀 Craftora Server running on port ${PORT}`);
    console.log(`🌐 Mode: ${process.env.NODE_ENV}`);
    console.log(`📡 Socket.io ready\n`);
  });
}

// Static file serving for locally uploaded product images
app.use('/uploads', express.static('public/uploads'));

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🎨 Craftora API is running', env: process.env.NODE_ENV });
});

// DB Check endpoint
app.get('/api/db-check', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database not connected (readyState: ${mongoose.connection.readyState}). Please check Atlas IP Whitelist and MONGO_URI.`);
    }
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    res.json({
      success: true,
      status: 'Connected',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      stats: {
        users: userCount,
        products: productCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/conversations', chatRoutes);
app.use('/api', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Export app for Vercel
module.exports = app;
