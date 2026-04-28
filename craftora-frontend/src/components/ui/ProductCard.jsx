import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Leaf, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, discountPercent, truncate, isInWishlist } from '../../utils/helpers';
import toast from 'react-hot-toast';

/* ── UNIQUE DYNAMIC IMAGE LOGIC ─────────────────── */
const getUniqueImage = (category, title) => {
  const cat = (category || '').toLowerCase();
  // Create a deterministic index based on the product title
  const hash = (title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (cat.includes('textile') || cat.includes('saree') || cat.includes('clothing')) {
    const images = [
      'https://images.unsplash.com/photo-1583391733958-d25e61c2c3e8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop',
      '/images/cat_textiles.png'
    ];
    return images[hash % images.length];
  }
  if (cat.includes('jewel') || cat.includes('ring') || cat.includes('necklace')) {
    const images = [
      'https://images.unsplash.com/photo-1573408301185-9519f94815b7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478524-fb66f70a00bf?q=80&w=600&auto=format&fit=crop',
      '/images/cat_jewelry.png'
    ];
    return images[hash % images.length];
  }
  if (cat.includes('ceramic') || cat.includes('pottery') || cat.includes('clay')) {
    const images = [
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613539246066-78ab61cb7e4b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590080875512-ce4b8810ce42?q=80&w=600&auto=format&fit=crop',
      '/images/cat_ceramics.png'
    ];
    return images[hash % images.length];
  }
  if (cat.includes('wood') || cat.includes('carving')) {
    const images = [
      'https://images.unsplash.com/photo-1511424187101-2aaa60069337?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?q=80&w=600&auto=format&fit=crop',
      '/images/cat_woodwork.png'
    ];
    return images[hash % images.length];
  }
  
  const genericImages = [
    'https://images.unsplash.com/photo-1606822350711-b4f0b9f93ec7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=600&auto=format&fit=crop',
    '/images/craftora_product_1777298014967.png'
  ];
  return genericImages[hash % genericImages.length];
};

const getLocalFallback = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('textile') || cat.includes('saree')) return '/images/cat_textiles.png';
  if (cat.includes('jewel') || cat.includes('ring')) return '/images/cat_jewelry.png';
  if (cat.includes('ceramic') || cat.includes('pottery')) return '/images/cat_ceramics.png';
  if (cat.includes('wood') || cat.includes('carving')) return '/images/cat_woodwork.png';
  return '/images/craftora_product_1777298014967.png';
};

export default function ProductCard({ product, index = 0 }) {
  const { user, toggleWishlist } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  const wishlisted = isInWishlist(user?.wishlist, product._id);
  const discount = discountPercent(product.price, product.discountPrice);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to save items'); return; }
    try {
      await toggleWishlist(product._id);
      toast.success(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist');
    } catch { toast.error('Something went wrong'); }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    addItem(product);
    openCart();
    toast.success(`${truncate(product.title, 30)} added to cart`);
  };

  // Intercept missing or broken backend URLs (like localhost:5000/uploads)
  let imageUrl = product.image || product.img || product.images?.[0]?.url || product.images?.[0];
  
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '' || imageUrl.includes('localhost:5000')) {
    imageUrl = getUniqueImage(product.category, product.title);
  }

  // Exact local fallback URL for broken images
  const fallbackUrl = getLocalFallback(product.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className="h-full w-full"
    >
      <Link to={`/products/${product._id}`} className="product-card group">
        
        {/* EXACT IMAGE STRUCTURE & SIZING */}
        <div className="card-img-wrapper bg-gray-200">
          <img
            src={imageUrl}
            alt={product.title ? `Image of ${product.title}` : 'Product Image'}
            loading="lazy"
            onError={(e) => { 
              // Prevent infinite loop if fallback also fails
              if (e.target.src.includes(fallbackUrl)) return; 
              e.target.onerror = null; 
              e.target.src = fallbackUrl; 
            }}
          />
          <div className="card-overlay absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isSustainable && (
              <span className="badge badge-sage backdrop-blur-md bg-white/90">
                <Leaf size={10} className="mr-1" /> Eco
              </span>
            )}
            {discount > 0 && (
              <span className="badge badge-terra backdrop-blur-md bg-white/90">-{discount}%</span>
            )}
            {product.stock === 0 && (
              <span className="badge badge-dark backdrop-blur-md">Sold Out</span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all"
            style={{
              background: wishlisted ? 'var(--terracotta)' : 'rgba(255,255,255,0.85)',
              borderColor: wishlisted ? 'var(--terracotta)' : 'rgba(255,255,255,0.5)',
            }}
            onClick={handleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart
              size={15}
              fill={wishlisted ? 'white' : 'none'}
              stroke={wishlisted ? 'white' : 'var(--terracotta)'}
            />
          </motion.button>

          {/* Hover actions */}
          <div className="card-actions z-10 absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 flex gap-2">
            <motion.button
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold shadow-lg"
              style={{ background: 'var(--terracotta)' }}
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={13} /> Add to Cart
            </motion.button>
          </div>
        </div>

        {/* Info Section (Flex layout ensures perfect alignment) */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-[var(--parchment)]">
          <div>
            {/* Category */}
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--terracotta)' }}>
              {product.category || 'Artisan Crafted'}
            </p>

            {/* Title */}
            <h3 className="font-display font-semibold text-lg leading-tight mb-3 group-hover:text-terracotta transition-colors line-clamp-2"
              style={{ color: 'var(--charcoal)' }}>
              {product.title || 'Untitled Masterpiece'}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1" style={{ color: '#FBBF24' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i} size={14}
                    fill={i < Math.round(product.averageRating || 5) ? 'currentColor' : 'none'}
                    stroke={i < Math.round(product.averageRating || 5) ? 'currentColor' : 'var(--sand)'}
                  />
                ))}
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--warm-gray)' }}>
                {product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}
                {product.numReviews > 0 && ` (${product.numReviews})`}
              </span>
            </div>
          </div>

          {/* Price & View Button */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t" style={{ borderColor: 'var(--sand)' }}>
            <div className="flex flex-col">
              <span className="font-bold text-lg" style={{ color: 'var(--charcoal)' }}>
                {formatPrice(product.discountPrice || product.price || 0)}
              </span>
              {product.discountPrice && (
                <span className="text-xs line-through" style={{ color: 'var(--warm-gray)' }}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            <Link to={`/products/${product._id}`} onClick={(e) => e.stopPropagation()}>
              <button className="flex items-center gap-1.5 btn-outline px-4 py-2 text-sm rounded-full bg-white hover:bg-transparent">
                View <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
