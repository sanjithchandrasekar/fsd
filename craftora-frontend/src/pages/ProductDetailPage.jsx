import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingBag, Heart, Star, Leaf, ChevronLeft, ChevronRight,
  MapPin, Share2, MessageCircle, Wand2, Package, Clock
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatPrice, formatDate, orderStatusMeta } from '../utils/helpers';
import ProductCard from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

/* ── Image Gallery ─────────────────────────────────── */
function ImageGallery({ images }) {
  const [active, setActive] = useState(0);
  const imgs = images?.length ? images : [{ url: 'https://placehold.co/600x600/F2EBE0/C1693A?text=Craftora' }];

  return (
    <div className="space-y-3">
      {/* Main */}
      <div className="relative rounded-3xl overflow-hidden aspect-square" style={{ background: 'var(--parchment)' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={imgs[active]?.url}
            alt="Product"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        {imgs.length > 1 && (
          <>
            <button className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center"
              onClick={() => setActive((a) => (a - 1 + imgs.length) % imgs.length)}>
              <ChevronLeft size={18} />
            </button>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center"
              onClick={() => setActive((a) => (a + 1) % imgs.length)}>
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <motion.button
              key={i}
              className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all"
              style={{ borderColor: active === i ? 'var(--terracotta)' : 'transparent' }}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.05 }}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Review Form ───────────────────────────────────── */
function ReviewForm({ productId, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error('Please write a comment'); return; }
    setLoading(true);
    try {
      await productAPI.addReview(productId, { rating, comment });
      toast.success('Review submitted!');
      setComment(''); setRating(5);
      onSubmit?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl space-y-4" style={{ background: 'var(--parchment)', border: '1px solid var(--sand)' }}>
      <h4 className="font-semibold" style={{ color: 'var(--charcoal)' }}>Write a Review</h4>
      <div className="flex gap-1">
        {[1,2,3,4,5].map((s) => (
          <button key={s} type="button" onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(s)}>
            <Star size={24} fill={(hovered || rating) >= s ? '#F59E0B' : 'none'} stroke={(hovered || rating) >= s ? '#F59E0B' : '#D1D5DB'} />
          </button>
        ))}
      </div>
      <textarea
        className="input-field resize-none h-24 text-sm"
        placeholder="Share your experience…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="btn-primary text-sm py-2.5 px-6" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}

/* ── Main Product Detail Page ──────────────────────── */
export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, toggleWishlist } = useAuthStore();
  const { addItem, openCart } = useCartStore();
  const [qty, setQty] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [tab, setTab] = useState('description');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id).then((r) => r.data),
  });

  const product = data?.product;
  const related = data?.related || [];

  if (isLoading) {
    return (
      <div className="pt-28 pb-16 section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="space-y-4">
            {[80, 60, 40, 100, 80].map((w, i) => (
              <div key={i} className="skeleton h-5 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-16 section-container text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--charcoal)' }}>Product not found</h2>
        <Link to="/shop"><button className="btn-primary">Back to Shop</button></Link>
      </div>
    );
  }

  const wishlisted = user?.wishlist?.some((w) => (w._id || w) === id);
  const finalPrice = product.discountPrice || product.price;
  const discount = product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    addItem(product, qty, customNote || null);
    openCart();
    toast.success('Added to cart 🛍️');
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in'); return; }
    await toggleWishlist(product._id);
    toast.success(wishlisted ? 'Removed from wishlist' : '❤️ Saved to wishlist');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--warm-gray)' }}>
          <Link to="/" className="hover:text-terracotta transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-terracotta transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-terracotta transition-colors">{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--charcoal)' }}>{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <ImageGallery images={product.images} />
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isSustainable && <span className="badge badge-sage"><Leaf size={10} /> Eco-Friendly</span>}
              {product.isCustomizable && <span className="badge badge-terra"><Wand2 size={10} /> Customizable</span>}
              {product.stock === 0 && <span className="badge badge-dark">Out of Stock</span>}
              {discount > 0 && <span className="badge badge-terra">-{discount}% OFF</span>}
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-3 leading-tight" style={{ color: 'var(--charcoal)' }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(product.averageRating) ? '#F59E0B' : 'none'}
                    stroke={s <= Math.round(product.averageRating) ? '#F59E0B' : '#D1D5DB'} />
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>{product.averageRating?.toFixed(1) || '0.0'}</span>
              <span className="text-sm" style={{ color: 'var(--warm-gray)' }}>({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold" style={{ color: 'var(--terracotta)' }}>
                {formatPrice(finalPrice)}
              </span>
              {product.discountPrice && (
                <span className="text-xl line-through" style={{ color: 'var(--warm-gray)' }}>{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Seller card */}
            {product.seller && (
              <Link to={`/artisans/${product.seller._id}`}>
                <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 cursor-pointer hover:border-terracotta transition-all"
                  style={{ background: 'var(--parchment)', border: '1px solid var(--sand)' }}>
                  <img
                    src={product.seller.avatar?.url || `https://placehold.co/50x50/F2EBE0/C1693A?text=${product.seller.name[0]}`}
                    alt={product.seller.name}
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>
                      {product.seller.name}
                      {product.seller.isVerified && <span className="ml-1 text-terracotta">✓</span>}
                    </p>
                    {product.seller.location?.city && (
                      <p className="text-xs flex items-center gap-1" style={{ color: 'var(--warm-gray)' }}>
                        <MapPin size={10} /> {product.seller.location.city}, {product.seller.location.country}
                      </p>
                    )}
                  </div>
                  <span className="ml-auto text-xs font-medium" style={{ color: 'var(--terracotta)' }}>View Profile →</span>
                </div>
              </Link>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: <Package size={14} />, label: 'Processing Time', value: product.processingTime || '3-5 days' },
                { icon: <Clock size={14} />, label: 'Stock', value: product.stock > 0 ? `${product.stock} available` : 'Out of stock' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'var(--parchment)' }}>
                  <span style={{ color: 'var(--terracotta)' }}>{icon}</span>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>Quantity</span>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'var(--parchment)', border: '1px solid var(--sand)' }}>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-terracotta hover:text-white transition-all font-bold"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="w-8 text-center font-semibold" style={{ color: 'var(--charcoal)' }}>{qty}</span>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-terracotta hover:text-white transition-all font-bold"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            {/* Custom note */}
            {product.isCustomizable && (
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>
                  Customization Note
                </label>
                <textarea
                  className="input-field text-sm resize-none h-20"
                  placeholder={product.customizationDetails || 'Describe your customization…'}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                />
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <motion.button
                className="btn-primary flex-1 justify-center text-base py-4"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <ShoppingBag size={18} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </motion.button>

              <motion.button
                className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all"
                style={{
                  borderColor: wishlisted ? 'var(--terracotta)' : 'var(--sand)',
                  background: wishlisted ? 'rgba(193,105,58,0.1)' : 'var(--parchment)',
                }}
                onClick={handleWishlist}
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} fill={wishlisted ? 'var(--terracotta)' : 'none'} stroke="var(--terracotta)" />
              </motion.button>

              {product.seller && user && user._id !== product.seller._id && (
                <Link to={`/chat?seller=${product.seller._id}&product=${product._id}`}>
                  <motion.button
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all"
                    style={{ borderColor: 'var(--sand)', background: 'var(--parchment)' }}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle size={20} style={{ color: 'var(--terracotta)' }} />
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Tab Section */}
        <div className="mb-16">
          <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--sand)' }}>
            {['description', 'artisan', 'reviews'].map((t) => (
              <button
                key={t}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${tab === t ? 'border-terracotta text-terracotta' : 'border-transparent'}`}
                style={{ color: tab === t ? 'var(--terracotta)' : 'var(--warm-gray)' }}
                onClick={() => setTab(t)}
              >
                {t === 'artisan' ? 'Meet the Artisan' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {tab === 'description' && (
                <div className="max-w-2xl space-y-6">
                  <p className="text-base leading-relaxed" style={{ color: 'var(--charcoal)' }}>{product.description}</p>
                  {product.story && (
                    <blockquote className="border-l-4 pl-6 italic font-elegant text-lg"
                      style={{ borderColor: 'var(--terracotta)', color: 'var(--warm-gray)' }}>
                      "{product.story}"
                    </blockquote>
                  )}
                  {product.materials?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2" style={{ color: 'var(--charcoal)' }}>Materials</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.materials.map((m) => (
                          <span key={m} className="badge badge-terra">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'artisan' && product.seller && (
                <div className="max-w-2xl">
                  <div className="flex items-start gap-6 p-6 rounded-2xl mb-6" style={{ background: 'var(--parchment)' }}>
                    <img
                      src={product.seller.avatar?.url || `https://placehold.co/100x100/F2EBE0/C1693A?text=${product.seller.name[0]}`}
                      alt={product.seller.name}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-display text-xl font-semibold mb-1" style={{ color: 'var(--charcoal)' }}>{product.seller.name}</h3>
                      {product.seller.location?.city && (
                        <p className="text-sm flex items-center gap-1 mb-3" style={{ color: 'var(--warm-gray)' }}>
                          <MapPin size={12} /> {product.seller.location.city}, {product.seller.location.country}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{product.seller.bio}</p>
                    </div>
                  </div>
                  {product.seller.artisanStory && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-base leading-relaxed" style={{ color: 'var(--charcoal)' }}>{product.seller.artisanStory}</p>
                    </div>
                  )}
                  {product.seller.artisanVideoUrl && (
                    <div className="mt-6 aspect-video rounded-2xl overflow-hidden">
                      <iframe src={product.seller.artisanVideoUrl} className="w-full h-full" allow="autoplay" allowFullScreen />
                    </div>
                  )}
                </div>
              )}

              {tab === 'reviews' && (
                <div className="max-w-2xl space-y-6">
                  {user && <ReviewForm productId={id} onSubmit={refetch} />}
                  {product.reviews?.length === 0 ? (
                    <p style={{ color: 'var(--warm-gray)' }}>No reviews yet. Be the first to share your experience!</p>
                  ) : (
                    product.reviews?.map((r) => (
                      <div key={r._id} className="p-4 rounded-2xl" style={{ background: 'var(--parchment)', border: '1px solid var(--sand)' }}>
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={r.user?.avatar?.url || `https://placehold.co/40x40/F2EBE0/C1693A?text=${r.user?.name?.[0] || 'U'}`}
                            alt="" className="w-9 h-9 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{r.user?.name || 'Anonymous'}</p>
                            <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{formatDate(r.createdAt)}</p>
                          </div>
                          <div className="ml-auto flex gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} size={13} fill={s <= r.rating ? '#F59E0B' : 'none'} stroke={s <= r.rating ? '#F59E0B' : '#D1D5DB'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="section-header text-left" style={{ marginBottom: '32px' }}>
              <span className="section-eyebrow">You May Also Love</span>
              <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--charcoal)' }}>Related Crafts</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {related.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
