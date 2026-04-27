import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { user, toggleWishlist } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  const wishlist = user?.wishlist || [];

  const handleRemove = async (productId) => {
    await toggleWishlist(productId);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    addItem(product);
    openCart();
    toast.success('Added to cart 🛍️');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="section-eyebrow">Saved Items</span>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-4xl font-bold" style={{ color: 'var(--charcoal)' }}>
              My <span style={{ color: 'var(--terracotta)' }}>Wishlist</span>
            </h1>
            <span className="badge badge-terra">{wishlist.length} items</span>
          </div>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--parchment)' }}
              animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart size={40} style={{ color: 'var(--warm-gray)' }} />
            </motion.div>
            <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--charcoal)' }}>Your wishlist is empty</h2>
            <p className="mb-8" style={{ color: 'var(--warm-gray)' }}>Save pieces that speak to your soul.</p>
            <Link to="/shop"><button className="btn-primary">Explore Shop</button></Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item, i) => {
              const product = typeof item === 'object' ? item : { _id: item };
              if (!product.title) return null;

              return (
                <motion.div
                  key={product._id}
                  className="glass-card overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Link to={`/products/${product._id}`}>
                      <img
                        src={product.images?.[0]?.url || `https://placehold.co/400x400/F2EBE0/C1693A?text=${product.title?.[0] || 'C'}`}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 hover:bg-red-50 transition-all"
                      onClick={() => handleRemove(product._id)}
                    >
                      <Trash2 size={15} className="text-red-400" />
                    </button>
                  </div>

                  <div className="p-4">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-medium text-sm mb-2 hover:text-terracotta transition-colors line-clamp-2"
                        style={{ color: 'var(--charcoal)' }}>
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: 'var(--terracotta)' }}>
                        {formatPrice(product.discountPrice || product.price || 0)}
                      </span>
                      <motion.button
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl"
                        style={{ background: 'var(--grad-terra)', color: '#fff' }}
                        onClick={() => handleAddToCart(product)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingBag size={13} /> Add
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
