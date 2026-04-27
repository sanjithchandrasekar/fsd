const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary storage for products
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'craftora/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// Cloudinary storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'craftora/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

// Cloudinary storage for feed posts
const feedStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'craftora/feed',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4'],
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'), false);
  }
};

const uploadProduct = multer({ storage: productStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadAvatar = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadFeed = multer({ storage: feedStorage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

module.exports = { uploadProduct, uploadAvatar, uploadFeed };
