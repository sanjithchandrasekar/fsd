import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../utils/helpers';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 1000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{ background: 'var(--cream)', boxShadow: '-20px 0 60px rgba(0,0,0,0.2)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--sand)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--grad-terra)' }}>
                  <ShoppingBag size={18} color="white" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--charcoal)' }}>Your Cart</h2>
                  <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button className="btn-ghost p-2 rounded-xl" onClick={closeCart}>
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <motion.div
                  className="h-full flex flex-col items-center justify-center gap-4 py-16"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--parchment)' }}>
                    <Package size={32} style={{ color: 'var(--warm-gray)' }} />
                  </div>
                  <p className="font-display text-xl" style={{ color: 'var(--charcoal)' }}>Your cart is empty</p>
                  <p className="text-sm text-center max-w-xs" style={{ color: 'var(--warm-gray)' }}>
                    Discover handcrafted treasures made with love by talented artisans.
                  </p>
                  <Link to="/shop" onClick={closeCart}>
                    <button className="btn-primary mt-2">Explore Shop</button>
                  </Link>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      className="flex gap-4 p-3 rounded-2xl"
                      style={{ background: 'var(--parchment)', border: '1px solid var(--sand)' }}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.25 }}
                      layout
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || `https://placehold.co/80x80/F2EBE0/C1693A?text=${item.title[0]}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight mb-1 line-clamp-2" style={{ color: 'var(--charcoal)' }}>
                          {item.title}
                        </p>
                        <p className="text-sm font-bold mb-3" style={{ color: 'var(--terracotta)' }}>
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 rounded-full px-2 py-1" style={{ background: 'var(--sand)' }}>
                            <button
                              className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-terracotta hover:text-white"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center" style={{ color: 'var(--charcoal)' }}>
                              {item.quantity}
                            </span>
                            <button
                              className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-terracotta hover:text-white"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            className="p-1.5 rounded-lg transition-all hover:bg-red-50 hover:text-red-500"
                            style={{ color: 'var(--warm-gray)' }}
                            onClick={() => removeItem(item._id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t space-y-4" style={{ borderColor: 'var(--sand)', background: 'var(--parchment)' }}>
                {/* Summary */}
                <div className="space-y-2">
                  {[
                    { label: 'Subtotal', value: formatPrice(subtotal) },
                    { label: 'Shipping', value: shipping === 0 ? 'FREE 🎉' : formatPrice(shipping) },
                    { label: 'GST (18%)', value: formatPrice(tax) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--warm-gray)' }}>{label}</span>
                      <span style={{ color: 'var(--charcoal)', fontWeight: value.includes('FREE') ? '700' : '500' }}>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: 'var(--sand)' }}>
                    <span style={{ color: 'var(--charcoal)' }}>Total</span>
                    <span style={{ color: 'var(--terracotta)' }}>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link to="/checkout" onClick={closeCart} className="block">
                  <motion.button
                    className="btn-primary w-full justify-center text-base py-3"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </motion.button>
                </Link>

                <button
                  className="w-full text-center text-xs py-2 hover:text-red-500 transition-colors"
                  style={{ color: 'var(--warm-gray)' }}
                  onClick={clearCart}
                >
                  Clear all items
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
