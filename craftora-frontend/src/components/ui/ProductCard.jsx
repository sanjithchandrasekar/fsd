import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Leaf, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, discountPercent, truncate, isInWishlist } from '../../utils/helpers';
import toast from 'react-hot-toast';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to={`/products/${product._id}`} className="product-card block group">
        {/* Image */}
        <div className="card-img-wrapper">
          <img
            src={product.images?.[0]?.url || `https://placehold.co/400x400/F2EBE0/C1693A?text=${encodeURIComponent(product.title[0])}`}
            alt={product.title}
            loading="lazy"
          />
          <div className="card-overlay" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isSustainable && (
              <span className="badge badge-sage">
                <Leaf size={9} /> Eco
              </span>
            )}
            {discount > 0 && (
              <span className="badge badge-terra">-{discount}%</span>
            )}
            {product.stock === 0 && (
              <span className="badge badge-dark">Sold Out</span>
            )}
            {product.isCustomizable && (
              <span className="badge" style={{ background: 'rgba(122,158,126,0.2)', color: 'var(--forest)' }}>
                ✨ Custom
              </span>
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
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              size={15}
              fill={wishlisted ? 'white' : 'none'}
              stroke={wishlisted ? 'white' : '#C1693A'}
            />
          </motion.button>

          {/* Hover actions */}
          <div className="card-actions z-10">
            <motion.button
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-semibold"
              style={{ background: 'var(--grad-terra)' }}
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={13} /> Add to Cart
            </motion.button>
            <Link to={`/products/${product._id}`} onClick={(e) => e.stopPropagation()}>
              <motion.button
                className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              >
                <Eye size={14} />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Seller */}
          {product.seller && (
            <p className="text-xs mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--warm-gray)' }}>
              {product.seller.avatar?.url && (
                <img src={product.seller.avatar.url} alt="" className="w-4 h-4 rounded-full object-cover" />
              )}
              {product.seller.name}
              {product.seller.isVerified && <span style={{ color: 'var(--terracotta)' }}>✓</span>}
            </p>
          )}

          {/* Title */}
          <h3 className="font-medium text-sm leading-snug mb-2 group-hover:text-terracotta transition-colors line-clamp-2"
            style={{ color: 'var(--charcoal)' }}>
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i} size={11}
                  fill={i < Math.round(product.averageRating) ? '#F59E0B' : 'none'}
                  stroke={i < Math.round(product.averageRating) ? '#F59E0B' : '#D1D5DB'}
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: 'var(--warm-gray)' }}>
              {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'New'}
              {product.numReviews > 0 && ` (${product.numReviews})`}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ color: 'var(--terracotta)' }}>
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs line-through" style={{ color: 'var(--warm-gray)' }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
