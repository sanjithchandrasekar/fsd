require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const FeedPost = require('./models/FeedPost');
const { getProducts } = require('./seedData');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/craftora';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Clearing existing data...');

    await User.deleteMany();
    await Product.deleteMany();
    await FeedPost.deleteMany();

    // ── Users ────────────────────────────────────────────────────────────────
    await User.create({ name: 'Admin User', email: 'admin@craftora.com', password: 'password123', role: 'admin', isVerified: true });
    await User.create({ name: 'Demo Buyer', email: 'buyer@craftora.com', password: 'password123', role: 'buyer' });

    const artisans = await User.insertMany([
      {
        name: 'Elena Rossi', email: 'elena@craftora.com', password: 'password123', role: 'seller',
        bio: 'Ceramic artist finding beauty in imperfection.',
        artisanStory: 'I grew up in Tuscany surrounded by clay. My work is inspired by the rolling hills and rustic textures of my homeland.',
        location: { city: 'Florence', country: 'Italy' }, isVerified: true,
        avatar: { url: 'https://ui-avatars.com/api/?name=Elena+Rossi&background=C1693A&color=fff&size=200&bold=true' },
        totalSales: 145, averageRating: 4.9
      },
      {
        name: 'Kenji Sato', email: 'kenji@craftora.com', password: 'password123', role: 'seller',
        bio: 'Woodworker blending traditional joinery with modern design.',
        artisanStory: 'Using hand tools passed down from my grandfather, I create pieces that connect the past with the present.',
        location: { city: 'Kyoto', country: 'Japan' }, isVerified: true,
        avatar: { url: 'https://ui-avatars.com/api/?name=Kenji+Sato&background=4A6741&color=fff&size=200&bold=true' },
        totalSales: 89, averageRating: 4.8
      },
      {
        name: 'Aisha Diallo', email: 'aisha@craftora.com', password: 'password123', role: 'seller',
        bio: 'Textile weaver preserving ancient patterns.',
        artisanStory: 'Every thread tells a story of my ancestors. I source local sustainable cotton to weave vibrant textiles.',
        location: { city: 'Dakar', country: 'Senegal' }, isVerified: true,
        avatar: { url: 'https://ui-avatars.com/api/?name=Aisha+Diallo&background=8A7E74&color=fff&size=200&bold=true' },
        totalSales: 210, averageRating: 5.0
      }
    ]);

    // ── Products (10 per category) ────────────────────────────────────────────
    console.log('Seeding 100 products...');
    const products = await Product.insertMany(getProducts(artisans));
    console.log(`✅ Inserted ${products.length} products`);

    // ── Feed Posts ────────────────────────────────────────────────────────────
    const BASE = 'http://localhost:5000/uploads/products';
    await FeedPost.insertMany([
      {
        author: artisans[0]._id, product: products[0]._id,
        caption: 'Fresh from the kiln! 🔥 The natural river clay gives such a warm grounding feel. #pottery #handmade #ceramics',
        images: [{ url: `${BASE}/pottery.png` }],
        tags: ['pottery', 'ceramics', 'handmade']
      },
      {
        author: artisans[1]._id, product: products[60]._id,
        caption: 'The grain on this walnut is incredible. 🪵 Something deeply satisfying about taking rough timber to a refined finish. #woodworking #walnut',
        images: [{ url: `${BASE}/woodwork.png` }],
        tags: ['woodworking', 'walnut', 'craftsmanship']
      },
      {
        author: artisans[2]._id, product: products[40]._id,
        caption: 'Dyeing day! Preparing the indigo vats for the new throw-blanket collection. 💙 #indigo #naturaldye #textileart',
        images: [{ url: `${BASE}/textiles.png` }],
        tags: ['indigo', 'naturaldye', 'textileart']
      },
      {
        author: artisans[0]._id, product: products[80]._id,
        caption: 'Poured a fresh batch of beeswax pillar candles today 🕯️ That honey scent fills the whole studio. #candles #beeswax #handpoured',
        images: [{ url: `${BASE}/candles.png` }],
        tags: ['candles', 'beeswax', 'handmade']
      },
      {
        author: artisans[1]._id, product: products[50]._id,
        caption: 'New leather journal with hand-embossed mandala cover just finished. ✨ Every line punched by hand. #leather #handstitched #journal',
        images: [{ url: `${BASE}/leather.png` }],
        tags: ['leather', 'journal', 'handcrafted']
      },
      {
        author: artisans[2]._id, product: products[20]._id,
        caption: 'Large abstract in deep indigo and gold leaf — one of my favourites this month 🎨 #painting #abstract #goldleaf',
        images: [{ url: `${BASE}/paintings.png` }],
        tags: ['painting', 'abstract', 'goldleaf']
      }
    ]);

    console.log('✅ Database seeded successfully! 100 products across 10 categories.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
