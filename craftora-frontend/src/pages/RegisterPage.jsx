import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, User, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      await register(form);
      toast.success('Welcome to Craftora! 🎨');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--grad-hero)' }}>
      <div className="blob w-96 h-96 top-0 left-0 opacity-15" style={{ background: 'var(--terracotta)' }} />
      <div className="blob w-72 h-72 bottom-0 right-0 opacity-15" style={{ background: 'var(--clay)', animationDelay: '4s' }} />

      <motion.div
        className="w-full max-w-lg relative z-10 rounded-3xl p-10"
        style={{ background: 'var(--cream)' }}
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--grad-terra)' }}>
            <Sparkles size={18} color="white" />
          </div>
          <span className="font-display text-xl font-bold" style={{ color: 'var(--charcoal)' }}>
            Craft<span style={{ color: 'var(--terracotta)' }}>ora</span>
          </span>
        </Link>

        <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--charcoal)' }}>
          Join the Community
        </h1>
        <p className="mb-8" style={{ color: 'var(--warm-gray)' }}>Create your free account and discover handcrafted wonders.</p>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { value: 'buyer', label: 'Buyer', icon: <ShoppingBag size={18} />, desc: 'Discover & shop handcrafted goods' },
            { value: 'seller', label: 'Artisan', icon: <User size={18} />, desc: 'Sell your handcrafted creations' },
          ].map(({ value, label, icon, desc }) => (
            <motion.button
              key={value}
              type="button"
              className="p-4 rounded-2xl border-2 text-left transition-all"
              style={{
                borderColor: form.role === value ? 'var(--terracotta)' : 'var(--sand)',
                background: form.role === value ? 'rgba(193,105,58,0.06)' : 'var(--parchment)',
              }}
              onClick={() => setForm({ ...form, role: value })}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-1" style={{ color: form.role === value ? 'var(--terracotta)' : 'var(--warm-gray)' }}>
                {icon}
                <span className="font-semibold text-sm">{label}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{desc}</p>
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Full Name</label>
            <input className="input-field" placeholder="Your full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Email</label>
            <input type="email" className="input-field" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="input-field pr-12"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} style={{ color: 'var(--warm-gray)' }} /> : <Eye size={16} style={{ color: 'var(--warm-gray)' }} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn-primary w-full justify-center text-base py-4 mt-2"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            {isLoading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : 'Create My Account ✨'
            }
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--warm-gray)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--terracotta)' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
