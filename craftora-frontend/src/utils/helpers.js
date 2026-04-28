// Format currency (INR default)
export const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

// Truncate text
export const truncate = (str, len = 80) =>
  str && str.length > len ? str.slice(0, len) + '…' : str;

// Get rating stars array
export const getRatingStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? 'filled' : 'empty'));

// Format date
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Get category gradient
export const categoryMeta = {
  Jewelry:   { emoji: '💍', color: '#C1693A', bg: 'rgba(193,105,58,0.12)' },
  Pottery:   { emoji: '🏺', color: '#8B6E4E', bg: 'rgba(139,110,78,0.12)' },
  Paintings: { emoji: '🖼️', color: '#7A9E7E', bg: 'rgba(122,158,126,0.12)' },
  Decor:     { emoji: '🕯️', color: '#9B7B6A', bg: 'rgba(155,123,106,0.12)' },
  Textiles:  { emoji: '🧵', color: '#A0522D', bg: 'rgba(160,82,45,0.12)' },
  Sculpture: { emoji: '🗿', color: '#708090', bg: 'rgba(112,128,144,0.12)' },
  Leather:   { emoji: '👜', color: '#8B4513', bg: 'rgba(139,69,19,0.12)' },
  Woodwork:  { emoji: '🪵', color: '#6B4423', bg: 'rgba(107,68,35,0.12)' },
  Candles:   { emoji: '🕯️', color: '#DAA520', bg: 'rgba(218,165,32,0.12)' },
  Other:     { emoji: '✨', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
};

// Calculate discount %
export const discountPercent = (original, discounted) =>
  discounted ? Math.round(((original - discounted) / original) * 100) : 0;

// Order status metadata
export const orderStatusMeta = {
  placed:            { label: 'Order Placed',         color: '#6B7280', icon: '📦' },
  confirmed:         { label: 'Confirmed',             color: '#3B82F6', icon: '✅' },
  crafting:          { label: 'Being Crafted',         color: '#F59E0B', icon: '🎨' },
  shipped:           { label: 'Shipped',               color: '#8B5CF6', icon: '🚚' },
  out_for_delivery:  { label: 'Out for Delivery',      color: '#F97316', icon: '🛵' },
  delivered:         { label: 'Delivered',             color: '#10B981', icon: '🎉' },
  cancelled:         { label: 'Cancelled',             color: '#EF4444', icon: '❌' },
  refunded:          { label: 'Refunded',              color: '#6366F1', icon: '💰' },
};

// Debounce
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Check if user has item in wishlist
export const isInWishlist = (wishlist = [], productId) =>
  wishlist.some((id) => (typeof id === 'object' ? id._id : id) === productId);

// Generate image placeholder URL
export const imgPlaceholder = (w = 400, h = 400, text = 'Craftora') =>
  `https://placehold.co/${w}x${h}/F2EBE0/C1693A?text=-&font=playfair-display`;
