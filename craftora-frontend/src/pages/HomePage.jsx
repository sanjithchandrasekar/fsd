import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../services/api';
import { ShieldCheck, TrendingUp, Globe, Sparkles, ArrowRight, Star, Quote } from 'lucide-react';

import ProductCard from '../components/ui/ProductCard';

/* ── Helper: SafeImage Component ─────────────────────────────────── */
function SafeImage({ src, alt, className }) {
  const genericFallback = '/images/craftora_hero_1777297935332.png';
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        onError={(e) => {
          if (e.target.src.includes(genericFallback)) return;
          e.target.onerror = null; 
          e.target.src = genericFallback;
        }}
      />
    </div>
  );
}

/* ── Hero Section ─────────────────────────────────── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Blobs for Warm Glow */}
      <div className="blob w-[600px] h-[600px] top-0 left-[-200px]" style={{ background: 'var(--terracotta)' }} />
      <div className="blob w-[500px] h-[500px] bottom-[-100px] right-[-100px]" style={{ background: 'var(--sage)' }} />

      <motion.div style={{ y, opacity }} className="section-container relative z-10 w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm mb-8 font-medium text-sm"
               style={{ background: 'rgba(193, 105, 58, 0.1)', borderColor: 'rgba(193, 105, 58, 0.2)', color: 'var(--terracotta)' }}>
            <Sparkles size={16} /> Welcome to the new standard of craftsmanship
          </div>
          
          <h1 className="section-title mb-6 leading-tight">
            Curated Masterpieces for the <br className="hidden md:block" />
            <span className="text-gradient font-extrabold">Modern Aesthete</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-10 max-w-2xl font-light leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
            Discover a world of hand-carved, hand-woven, and hand-painted treasures. 
            Directly from master artisans to your space, with zero middleman markup.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/shop" className="w-full sm:w-auto">
              <button className="btn-primary w-full px-8 py-4 text-base">
                Explore Collection <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/artisans" className="w-full sm:w-auto">
              <button className="btn-outline w-full px-8 py-4 text-base">
                Meet the Artisans
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Metrics / Trust Strip ─────────────────────────────────── */
function MetricsStrip() {
  const metrics = [
    { value: "10k+", label: "Verified Artisans", icon: <ShieldCheck size={24} style={{ color: 'var(--terracotta)' }} /> },
    { value: "50k+", label: "Unique Pieces", icon: <Sparkles size={24} style={{ color: 'var(--sage)' }} /> },
    { value: "100%", label: "Authentic Goods", icon: <TrendingUp size={24} style={{ color: 'var(--terracotta)' }} /> },
    { value: "Global", label: "Insured Shipping", icon: <Globe size={24} style={{ color: 'var(--sage)' }} /> },
  ];

  return (
    <div className="relative z-20" style={{ background: 'var(--parchment)', borderTop: '1px solid var(--sand)', borderBottom: '1px solid var(--sand)' }}>
      <div className="section-container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col items-center justify-center text-center ${i % 2 !== 0 ? 'border-l md:border-none' : ''}`}
              style={{ borderColor: 'var(--sand)' }}
            >
              <div className="mb-3 p-3 rounded-2xl" style={{ background: 'rgba(193, 105, 58, 0.1)', border: '1px solid rgba(193, 105, 58, 0.2)' }}>
                {m.icon}
              </div>
              <h4 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--charcoal)' }}>{m.value}</h4>
              <p className="text-sm font-medium tracking-wide uppercase" style={{ color: 'var(--warm-gray)' }}>{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Categories Grid ─────────────────────────────────── */
function CategoriesGrid() {
  const categories = [
    { name: "Textiles & Sarees", img: "/images/cat_textiles.png", span: "md:col-span-2 md:row-span-2" },
    { name: "Fine Jewelry", img: "/images/cat_jewelry.png", span: "col-span-1 row-span-1" },
    { name: "Ceramics", img: "/images/cat_ceramics.png", span: "col-span-1 row-span-1" },
    { name: "Woodwork", img: "/images/cat_woodwork.png", span: "md:col-span-2 row-span-1" },
  ];

  return (
    <section className="py-32 relative">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="section-eyebrow">Curated Collections</span>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link to="/shop">
            <button className="btn-outline">View All Collections</button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[250px_250px] gap-6">
          {categories.map((cat, i) => (
            <Link key={i} to={`/shop?category=${encodeURIComponent(cat.name)}`} className={`group relative rounded-3xl overflow-hidden block ${cat.span}`} style={{ border: '1px solid var(--sand)' }}>
              <SafeImage src={cat.img} alt={cat.name} className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-white">{cat.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border border-white/20">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About Section ─────────────────────────────────── */
function AboutSection() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'var(--parchment)' }}>
      <div className="absolute top-0 right-0 w-1/2 h-full blur-[120px] pointer-events-none opacity-20" style={{ background: 'var(--terracotta)' }} />
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="space-y-8 relative z-10"
          >
            <div>
              <span className="section-eyebrow">Our Philosophy</span>
              <h2 className="section-title text-3xl md:text-5xl leading-tight">
                Empowering Creators, <br />
                <span style={{ color: 'var(--terracotta)' }}>Preserving Heritage.</span>
              </h2>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
              Craftora is not just a marketplace; it is an ecosystem built for the creators. We provide the infrastructure for artisans to showcase their lifework to a global audience without losing their identity or profit margins to intermediaries.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
              Every purchase made here directly funds the sustainability of ancient crafts and the communities that keep them alive.
            </p>
            <div className="pt-4">
              <Link to="/about">
                <button className="btn-primary">Learn More About Us</button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-40" style={{ background: 'var(--grad-terra)' }} />
            <div className="glass-card rounded-[2rem] p-4 relative">
              <SafeImage 
                src="/images/about_artisan.png" 
                alt="Artisan hands shaping clay" 
                className="rounded-[1.5rem] aspect-[4/5] object-cover"
                style={{ border: '1px solid var(--glass-border)' }}
              />
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--terracotta)' }}>
                  <Star className="text-white fill-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: 'var(--charcoal)' }}>4.9/5</p>
                  <p className="text-sm" style={{ color: 'var(--warm-gray)' }}>Average rating from buyers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Dynamic Product Row ─────────────────────────────────── */
function ProductRow({ products }) {
  const fallbackProducts = [
    {
      _id: 'prod-1',
      title: 'Kanjeevaram Royal Silk Saree',
      price: 245,
      category: 'Textiles',
      averageRating: 4.9,
      img: '/images/cat_textiles.png'
    },
    {
      _id: 'prod-2',
      title: 'Hand-Hammered Silver Cuff',
      price: 180,
      category: 'Jewelry',
      averageRating: 4.8,
      img: '/images/cat_jewelry.png'
    },
    {
      _id: 'prod-3',
      title: 'Terracotta Amphora Vase',
      price: 120,
      category: 'Ceramics',
      averageRating: 5.0,
      img: '/images/cat_ceramics.png'
    },
    {
      _id: 'prod-4',
      title: 'Carved Walnut Wood Bowl',
      price: 95,
      category: 'Woodwork',
      averageRating: 4.7,
      img: '/images/cat_woodwork.png'
    }
  ];

  const displayProducts = products && products.length >= 4 ? products : fallbackProducts;

  return (
    <section className="py-32 relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="section-eyebrow">Curated Selection</span>
          <h2 className="section-title">Featured Masterpieces</h2>
          <p className="section-subtitle">Exquisite items selected for their exceptional quality and story.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.slice(0, 4).map((p, i) => (
            <div key={p._id} className="h-[420px]">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ─────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah L.", role: "Interior Designer", text: "The quality of the ceramics is unmatched. The platform makes it so easy to source authentic, high-end pieces for my clients." },
    { name: "James K.", role: "Art Collector", text: "I was blown away by the detail in the woodwork. Craftora truly connects you with master artisans globally." },
    { name: "Priya M.", role: "Verified Buyer", text: "Beautiful Banarasi silk! The colors are vibrant and the texture is authentic. Fast shipping too." },
  ];

  return (
    <section className="py-32 relative" style={{ background: 'var(--parchment)' }}>
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="section-eyebrow">Reviews</span>
          <h2 className="section-title">What Our Patrons Say</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300"
            >
              <Quote className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity" size={120} style={{ color: 'var(--terracotta)' }} />
              <div className="flex gap-1 mb-6 relative z-10" style={{ color: '#FBBF24' }}>
                {[...Array(5)].map((_, idx) => <Star key={idx} size={16} className="fill-current" />)}
              </div>
              <p className="text-lg mb-8 relative z-10 font-body leading-relaxed" style={{ color: 'var(--warm-gray)' }}>"{t.text}"</p>
              <div className="relative z-10">
                <h4 className="font-display font-bold text-lg" style={{ color: 'var(--charcoal)' }}>{t.name}</h4>
                <p className="text-sm font-medium" style={{ color: 'var(--terracotta-lt)' }}>{t.role}</p>
              </div>
            </motion.div>
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
    <main className="min-h-screen">
      <HeroSection />
      <MetricsStrip />
      <CategoriesGrid />
      <AboutSection />
      <ProductRow products={featured} />
      <TestimonialsSection />
    </main>
  );
}
