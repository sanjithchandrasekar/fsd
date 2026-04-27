require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const FeedPost = require('./models/FeedPost');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/craftora';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB. Clearing existing data...');

    await User.deleteMany();
    await Product.deleteMany();
    await FeedPost.deleteMany();

    console.log('Seeding Users...');
    // Create demo users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@craftora.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });

    const buyer = await User.create({
      name: 'Demo Buyer',
      email: 'buyer@craftora.com',
      password: 'password123',
      role: 'buyer'
    });

    // Create artisans
    const artisansData = [
      {
        name: 'Elena Rossi',
        email: 'elena@craftora.com',
        password: 'password123',
        role: 'seller',
        bio: 'Ceramic artist finding beauty in imperfection.',
        artisanStory: 'I grew up in Tuscany, surrounded by clay. My work is inspired by the rolling hills and rustic textures of my homeland.',
        location: { city: 'Florence', country: 'Italy' },
        isVerified: true,
        avatar: { url: 'https://placehold.co/400x400/F2EBE0/C1693A?text=ER' },
        totalSales: 145,
        averageRating: 4.9
      },
      {
        name: 'Kenji Sato',
        email: 'kenji@craftora.com',
        password: 'password123',
        role: 'seller',
        bio: 'Woodworker blending traditional joinery with modern design.',
        artisanStory: 'Using hand tools passed down from my grandfather, I create pieces that connect the past with the present.',
        location: { city: 'Kyoto', country: 'Japan' },
        isVerified: true,
        avatar: { url: 'https://placehold.co/400x400/F2EBE0/C1693A?text=KS' },
        totalSales: 89,
        averageRating: 4.8
      },
      {
        name: 'Aisha Diallo',
        email: 'aisha@craftora.com',
        password: 'password123',
        role: 'seller',
        bio: 'Textile weaver preserving ancient patterns.',
        artisanStory: 'Every thread tells a story of my ancestors. I source local, sustainable cotton to weave vibrant textiles.',
        location: { city: 'Dakar', country: 'Senegal' },
        isVerified: true,
        avatar: { url: 'https://placehold.co/400x400/F2EBE0/C1693A?text=AD' },
        totalSales: 210,
        averageRating: 5.0
      }
    ];

    const artisans = await User.insertMany(artisansData);

    console.log('Seeding Products...');
    // Create products
    const productsData = [
      {
        seller: artisans[0]._id,
        title: 'Rustic Terracotta Vase',
        description: 'A hand-thrown terracotta vase with a raw, earthy finish. Perfect for dried flowers or as a standalone sculptural piece.',
        story: 'The clay for this vase was sourced directly from the riverbanks near my studio.',
        price: 3500,
        category: 'Pottery & Ceramics',
        stock: 5,
        images: [{ url: 'https://placehold.co/800x800/E8DCC4/8A5A44?text=Terracotta+Vase' }],
        isSustainable: true,
        materials: ['Terracotta Clay', 'Natural Glaze'],
        tags: ['rustic', 'vase', 'earthy', 'handmade'],
        processingTime: '3-5 days',
        status: 'approved',
        totalSales: 12,
        averageRating: 4.8,
        numReviews: 4
      },
      {
        seller: artisans[0]._id,
        title: 'Speckled Ceramic Mug Set',
        description: 'Set of two handmade ceramic mugs with a speckled white glaze. Ergonomic handle and thick walls to keep your coffee warm.',
        price: 2200,
        discountPrice: 1800,
        category: 'Pottery & Ceramics',
        stock: 12,
        images: [{ url: 'https://placehold.co/800x800/F4F1EB/4A5568?text=Ceramic+Mugs' }],
        isSustainable: true,
        materials: ['Stoneware', 'Food-safe Glaze'],
        tags: ['mugs', 'coffee', 'minimalist'],
        status: 'approved',
        totalSales: 45
      },
      {
        seller: artisans[1]._id,
        title: 'Walnut Minimalist Desk Organizer',
        description: 'Keep your workspace tidy with this elegant desk organizer crafted from sustainably sourced walnut wood. Features slots for pens, phone, and small accessories.',
        price: 5400,
        category: 'Woodworking',
        stock: 3,
        images: [{ url: 'https://placehold.co/800x800/D2B48C/5C4033?text=Wood+Organizer' }],
        isSustainable: true,
        isCustomizable: true,
        customizationDetails: 'Can be engraved with initials (max 3 letters).',
        materials: ['Walnut Wood', 'Beeswax Finish'],
        tags: ['desk', 'office', 'wood', 'organizer'],
        status: 'approved',
        totalSales: 8
      },
      {
        seller: artisans[2]._id,
        title: 'Handwoven Indigo Throw Blanket',
        description: 'A luxuriously soft cotton throw blanket dyed with natural indigo. Woven on a traditional floor loom, each piece is unique.',
        price: 8900,
        category: 'Textiles & Fiber',
        stock: 8,
        images: [{ url: 'https://placehold.co/800x800/E0F2FE/1E3A8A?text=Indigo+Throw' }],
        isSustainable: true,
        materials: ['Organic Cotton', 'Natural Indigo Dye'],
        tags: ['blanket', 'indigo', 'woven', 'cozy'],
        status: 'approved',
        totalSales: 22
      },
      {
        seller: artisans[2]._id,
        title: 'Vibrant Geometric Cushion Cover',
        description: 'Add a pop of color to your living room with this handwoven cushion cover featuring traditional geometric motifs.',
        price: 3200,
        category: 'Textiles & Fiber',
        stock: 15,
        images: [{ url: 'https://placehold.co/800x800/FEF3C7/B45309?text=Cushion+Cover' }],
        materials: ['Cotton Blend'],
        status: 'approved',
        totalSales: 35
      }
    ];

    const products = await Product.insertMany(productsData);

    console.log('Seeding Feed Posts...');
    const feedPostsData = [
      {
        author: artisans[0]._id,
        product: products[0]._id,
        caption: 'Fresh out of the kiln! Absolutely love how the rustic texture turned out on this new batch of vases. The natural river clay gives it such a warm, grounding feel. ✨ #pottery #ceramics #handmade',
        images: [{ url: 'https://placehold.co/800x800/E8DCC4/8A5A44?text=Kiln+Opening' }],
        tags: ['pottery', 'ceramics', 'handmade', 'process']
      },
      {
        author: artisans[1]._id,
        caption: 'Working on a custom desk organizer today. The grain on this piece of walnut is incredible. There is something deeply satisfying about feeling a rough piece of timber become smooth and refined. 🪵',
        images: [{ url: 'https://placehold.co/800x800/D2B48C/5C4033?text=Woodworking+Process' }],
        tags: ['woodworking', 'craftsmanship', 'walnut', 'studio']
      },
      {
        author: artisans[2]._id,
        product: products[3]._id,
        caption: 'Dyeing day! Preparing the indigo vats for the new collection of throw blankets. The vibrant blue color is slowly coming to life. 💙 #indigo #naturaldye #textileart',
        images: [{ url: 'https://placehold.co/800x800/E0F2FE/1E3A8A?text=Indigo+Dyeing' }],
        tags: ['indigo', 'naturaldye', 'textileart', 'weaving']
      }
    ];

    await FeedPost.insertMany(feedPostsData);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
