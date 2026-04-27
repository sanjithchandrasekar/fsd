import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../services/api';
import { Truck, ShieldCheck, Tag, HeartHandshake, ChevronRight, Star, Clock, Mail, Quote } from 'lucide-react';

/* ── Helper: Safe Image Component ─────────────────────────────────── */
function SafeImage({ src, alt, className }) {
  return (
    <div className={`relative bg-gray-200 flex items-center justify-center overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = `https://placehold.co/600x600/f1f5f9/f1f5f9?text=-`;
        }}
      />
    </div>
  );
}

/* ── Hero Banner ─────────────────────────────────── */
function HeroBanner() {
  return (
    <section className="w-full relative bg-amber-50">
      <div className="w-full h-[500px] md:h-[700px] relative">
        <SafeImage 
          src="https://images.unsplash.com/photo-1544626053-8985dc412d26?q=80&w=2000&auto=format&fit=crop" 
          alt="Craftora Hero" 
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <h2 className="text-yellow-400 font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base">The Artisan Edit</h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">Masterpieces of Heritage</h1>
              <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light">Discover a world of hand-carved, hand-woven, and hand-painted treasures crafted with soul.</p>
              <Link to="/shop">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg">
                  Shop the Collection
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Features Strip ─────────────────────────────────── */
function FeaturesStrip() {
  const features = [
    { icon: <Truck size={28} />, title: "Free Shipping", desc: "On orders over $50" },
    { icon: <ShieldCheck size={28} />, title: "100% Authentic", desc: "Direct from makers" },
    { icon: <Tag size={28} />, title: "Fair Pricing", desc: "No middleman markup" },
    { icon: <HeartHandshake size={28} />, title: "Support Artisans", desc: "Empowering communities" },
  ];
  return (
    <div className="w-full bg-white border-b border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-yellow-600 bg-yellow-50 p-4 rounded-full">{f.icon}</div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{f.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── About Us Section ─────────────────────────────────── */
function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 w-full order-2 md:order-1 mb-12 md:mb-0">
            <div className="relative mt-8 md:mt-0">
              <div className="absolute inset-0 bg-yellow-500 rounded-2xl transform translate-x-4 translate-y-4"></div>
              <SafeImage 
                src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=800&auto=format&fit=crop" 
                alt="Artisan crafting" 
                className="relative z-10 rounded-2xl shadow-xl aspect-square md:aspect-[4/5] w-full"
              />
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h3 className="text-yellow-600 font-bold tracking-[0.2em] uppercase mb-4 text-sm">Our Story</h3>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">Preserving Heritage, Empowering Creators</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              At Craftora, we believe that every handcrafted piece tells a story of tradition, dedication, and artistry. We bridge the gap between talented artisans and global connoisseurs.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              By removing the middlemen, we ensure that creators receive fair compensation for their invaluable skills, while you receive authentic, museum-quality pieces that breathe life into your space.
            </p>
            <Link to="/about">
              <button className="text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white font-bold px-8 py-3 rounded-full transition-all">
                Learn More About Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Shop by Category (Grid) ─────────────────────────────────── */
function ShopByCategory() {
  const categories = [
    { name: "Sarees", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop" },
    { name: "Jewelry", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop" },
    { name: "Home Decor", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop" },
    { name: "Paintings", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-yellow-600 font-bold tracking-[0.2em] uppercase mb-4 text-sm">Collections</h3>
          <h2 className="text-4xl font-display font-bold text-gray-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <Link key={i} to={`/shop?category=${cat.name}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-4">
                <SafeImage src={cat.img} alt={cat.name} className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <span className="inline-block bg-white/90 backdrop-blur text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/shop">
            <button className="text-yellow-600 font-bold hover:text-yellow-700 flex items-center gap-2 mx-auto">
              View All Categories <ChevronRight size={20} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Dynamic Product Row ─────────────────────────────────── */
function ProductRow({ title, subtitle, products }) {
  const fallbackProducts = Array.from({ length: 4 }).map((_, i) => ({
    _id: `fallback-${i}`,
    title: `Handcrafted Masterpiece ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 20,
    category: 'Artisan Crafted',
    averageRating: 4.8,
    img: `https://placehold.co/400x400/E2E8F0/475569?text=${encodeURIComponent('Artisan Item ' + (i + 1))}`
  }));

  const displayProducts = products && products.length >= 4 ? products : fallbackProducts;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-yellow-600 font-bold tracking-[0.2em] uppercase mb-4 text-sm">{subtitle}</h3>
          <h2 className="text-4xl font-display font-bold text-gray-900">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.slice(0, 4).map((p) => {
            const imageUrl = p.image || p.img || p.images?.[0]?.url || p.images?.[0] || `https://placehold.co/400x400/E2E8F0/475569?text=${encodeURIComponent(p.title[0])}`;
            return (
              <div key={p._id} className="bg-white rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100">
                <div className="relative aspect-square overflow-hidden bg-gray-100 shrink-0">
                  <SafeImage src={imageUrl} alt={p.title} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-gray-700">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" /> {p.averageRating ? p.averageRating.toFixed(1) : '5.0'}
                  </div>
                </div>
                <div className="p-6 flex flex-col grow">
                  <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-2">{p.category}</p>
                  <Link to={`/products/${p._id}`} className="grow">
                    <h4 className="font-bold text-gray-900 text-lg line-clamp-2 hover:text-yellow-600 transition-colors mb-4">{p.title}</h4>
                  </Link>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xl font-extrabold text-gray-900">${p.price}</span>
                    <Link to={`/products/${p._id}`}>
                      <button className="bg-gray-900 text-white hover:bg-yellow-500 px-5 py-2 rounded-full font-medium transition-colors text-sm">
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link to="/shop">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-3 rounded-full transition-all shadow-md">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials Section ─────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah L.", role: "Interior Designer", text: "The quality of the terracota pieces is simply unmatched. It brings such warmth to my clients' homes." },
    { name: "James K.", role: "Art Collector", text: "I was blown away by the detail in the woodwork. Craftora truly connects you with master artisans." },
    { name: "Priya M.", role: "Customer", text: "Beautiful Banarasi silk! The colors are vibrant and the texture is authentic. Fast shipping too." },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-yellow-600 font-bold tracking-[0.2em] uppercase mb-4 text-sm">Reviews</h3>
          <h2 className="text-4xl font-display font-bold text-gray-900">What Our Patrons Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-2xl relative overflow-hidden">
              <Quote className="absolute -top-4 -right-4 text-yellow-300 opacity-20 z-0" size={100} />
              <div className="flex gap-1 text-yellow-400 mb-6 relative z-10">
                {[...Array(5)].map((_, idx) => <Star key={idx} size={18} className="fill-current" />)}
              </div>
              <p className="text-gray-700 text-lg mb-8 relative z-10 font-serif italic">"{t.text}"</p>
              <div>
                <h4 className="font-bold text-gray-900">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



/* ── Main Home Page ────────────────────────────────── */
export default function HomePage() {
  const { data } = useQuery({
    queryKey: ['featured'],
    queryFn: () => productAPI.getFeatured().then((r) => r.data),
  });

  const featured = data?.featured?.slice(0, 4) || [];

  return (
    <main className="font-sans bg-white selection:bg-yellow-500 selection:text-white">
      <HeroBanner />
      <FeaturesStrip />
      <AboutSection />
      <ShopByCategory />
      <ProductRow subtitle="Curated Selection" title="Featured Masterpieces" products={featured} />
      <TestimonialsSection />
    </main>
  );
}
