import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success('Welcome back! 🎨');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--grad-hero)' }}>
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden">
        <div className="blob w-96 h-96 top-0 left-0 opacity-20" style={{ background: 'var(--terracotta)' }} />
        <div className="blob w-72 h-72 bottom-0 right-0 opacity-20" style={{ background: 'var(--sage)', animationDelay: '4s' }} />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--grad-terra)' }}>
            <Sparkles size={20} color="white" />
          </div>
          <span className="font-display text-2xl font-bold text-white">Craft<span style={{ color: 'var(--terracotta-lt)' }}>ora</span></span>
        </Link>

        <div className="relative z-10">
          <blockquote className="font-elegant text-3xl text-white leading-relaxed mb-6 italic">
            "Every handcrafted piece is a conversation between the maker and the world."
          </blockquote>
          <div className="flex gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="w-16 h-16 rounded-2xl overflow-hidden opacity-70">
                <img src={`https://placehold.co/80x80/C1693A/FAF6F1?text=${i}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs relative z-10" style={{ color: 'rgba(242,235,224,0.4)' }}>© 2024 Craftora. Handcrafted with ❤️</p>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{ background: 'var(--cream)' }}>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="mb-10">
            <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--charcoal)' }}>
              Welcome <span style={{ color: 'var(--terracotta)' }}>back</span>
            </h1>
            <p style={{ color: 'var(--warm-gray)' }}>Sign in to explore handcrafted treasures.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Your password"
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
              className="btn-primary w-full justify-center text-base py-4"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ArrowRight size={18} /> Sign In</>
              )}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-4 rounded-xl text-xs" style={{ background: 'var(--parchment)', border: '1px solid var(--sand)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--terracotta)' }}>Demo Accounts:</p>
            <p style={{ color: 'var(--warm-gray)' }}>Buyer: buyer@craftora.com / password123</p>
            <p style={{ color: 'var(--warm-gray)' }}>Seller: seller@craftora.com / password123</p>
            <p style={{ color: 'var(--warm-gray)' }}>Admin: admin@craftora.com / password123</p>
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: 'var(--warm-gray)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--terracotta)' }}>Create one free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
