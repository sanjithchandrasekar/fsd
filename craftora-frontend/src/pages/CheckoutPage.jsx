import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  const [address, setAddress] = useState({
    fullName: user?.name || '', address: '', city: '', state: '', zipCode: '', country: 'India', phone: '',
  });
  const [payMethod, setPayMethod] = useState('dummy');

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.create({
        items: items.map((i) => ({ product: i._id, quantity: i.quantity, isCustomOrder: i.isCustomOrder, customDetails: i.customDetails })),
        shippingAddress: address,
        paymentMethod: payMethod,
      });
      clearCart();
      setOrderId(data.order._id);
      setStep(2);
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    }
    setLoading(false);
  };

  if (items.length === 0 && !orderId) {
    return (
      <div className="pt-28 min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--cream)' }}>
        <div className="text-6xl">🛒</div>
        <h2 className="font-display text-2xl" style={{ color: 'var(--charcoal)' }}>Your cart is empty</h2>
        <Link to="/shop"><button className="btn-primary">Continue Shopping</button></Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container max-w-5xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i <= step ? 'text-white' : 'text-warm-gray'
                }`} style={{ background: i <= step ? 'var(--terracotta)' : 'var(--sand)' }}>
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span className="font-medium text-sm hidden sm:block" style={{ color: i <= step ? 'var(--terracotta)' : 'var(--warm-gray)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-12 h-0.5 rounded" style={{ background: i < step ? 'var(--terracotta)' : 'var(--sand)' }} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0 - Shipping */}
              {step === 0 && (
                <motion.div key="shipping"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-display text-2xl font-semibold flex items-center gap-2" style={{ color: 'var(--charcoal)' }}>
                    <MapPin size={22} style={{ color: 'var(--terracotta)' }} /> Shipping Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', full: true },
                      { key: 'address', label: 'Street Address', placeholder: '123 Art Lane', full: true },
                      { key: 'city', label: 'City', placeholder: 'Mumbai' },
                      { key: 'state', label: 'State', placeholder: 'Maharashtra' },
                      { key: 'zipCode', label: 'PIN Code', placeholder: '400001' },
                      { key: 'phone', label: 'Phone', placeholder: '+91 9876543210' },
                    ].map(({ key, label, placeholder, full }) => (
                      <div key={key} className={full ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>{label}</label>
                        <input className="input-field" placeholder={placeholder} value={address[key]}
                          onChange={(e) => setAddress({ ...address, [key]: e.target.value })} required />
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className="btn-primary w-full justify-center py-4 text-base"
                    onClick={() => {
                      if (!address.fullName || !address.address || !address.city || !address.zipCode) {
                        toast.error('Please fill all required fields'); return;
                      }
                      setStep(1);
                    }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    Continue to Payment <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 1 - Payment */}
              {step === 1 && (
                <motion.div key="payment"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-semibold flex items-center gap-2" style={{ color: 'var(--charcoal)' }}>
                    <CreditCard size={22} style={{ color: 'var(--terracotta)' }} /> Payment Method
                  </h2>

                  <div className="space-y-3">
                    {[
                      { value: 'dummy', label: 'Demo Payment (No real charge)', desc: 'Test the checkout flow safely', emoji: '🧪' },
                      { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', emoji: '💵' },
                      { value: 'stripe', label: 'Stripe (Card/UPI)', desc: 'Secure payment via Stripe', emoji: '💳' },
                    ].map(({ value, label, desc, emoji }) => (
                      <motion.button
                        key={value}
                        type="button"
                        className="w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all"
                        style={{
                          borderColor: payMethod === value ? 'var(--terracotta)' : 'var(--sand)',
                          background: payMethod === value ? 'rgba(193,105,58,0.06)' : 'var(--parchment)',
                        }}
                        onClick={() => setPayMethod(value)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{label}</p>
                          <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{desc}</p>
                        </div>
                        <div className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: payMethod === value ? 'var(--terracotta)' : 'var(--sand)' }}>
                          {payMethod === value && <div className="w-3 h-3 rounded-full" style={{ background: 'var(--terracotta)' }} />}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="btn-ghost flex items-center gap-2" onClick={() => setStep(0)}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <motion.button
                      className="btn-primary flex-1 justify-center py-4 text-base"
                      onClick={placeOrder}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                      {loading
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><Package size={18} /> Place Order – {formatPrice(total)}</>
                      }
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 - Confirmation */}
              {step === 2 && (
                <motion.div key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'rgba(122,158,126,0.15)' }}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                  >
                    <CheckCircle size={48} style={{ color: 'var(--forest)' }} />
                  </motion.div>

                  <div>
                    <h2 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--charcoal)' }}>
                      Order Placed! 🎉
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--warm-gray)' }}>
                      Your handcrafted treasures are being prepared with love.
                    </p>
                    {orderId && (
                      <p className="mt-2 font-mono text-xs px-3 py-1 rounded-lg inline-block mt-3"
                        style={{ background: 'var(--parchment)', color: 'var(--charcoal)' }}>
                        Order ID: #{orderId.slice(-8).toUpperCase()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/orders"><button className="btn-primary">Track My Order</button></Link>
                    <Link to="/shop"><button className="btn-outline">Continue Shopping</button></Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          {step < 2 && (
            <div className="glass-card p-6 h-fit sticky top-28">
              <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--charcoal)' }}>Order Summary</h3>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img src={item.image || 'https://placehold.co/50x50/F2EBE0/C1693A?text=C'} alt=""
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1" style={{ color: 'var(--charcoal)' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0" style={{ color: 'var(--terracotta)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2" style={{ borderColor: 'var(--sand)' }}>
                {[
                  { label: 'Subtotal', value: formatPrice(subtotal) },
                  { label: 'Shipping', value: shipping === 0 ? 'FREE' : formatPrice(shipping) },
                  { label: 'GST (18%)', value: formatPrice(tax) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--warm-gray)' }}>{label}</span>
                    <span style={{ color: 'var(--charcoal)', fontWeight: value === 'FREE' ? '700' : '400' }}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: 'var(--sand)' }}>
                  <span style={{ color: 'var(--charcoal)' }}>Total</span>
                  <span style={{ color: 'var(--terracotta)' }}>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
