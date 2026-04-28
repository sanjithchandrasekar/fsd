import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/craftora_bg_fallback_1777298048612.png" 
          alt="Artisan Background" 
          className="w-full h-full object-cover scale-105" 
          style={{ filter: 'brightness(0.6) saturate(1.2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512]/90 via-[#2C2522]/50 to-transparent mix-blend-multiply" />
      </div>

      <motion.div
        className="w-full max-w-[440px] relative z-10 mx-4"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Floating Glass Card */}
        <div 
          className="rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden"
          style={{ 
            background: 'rgba(250, 246, 241, 0.92)', 
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-30 pointer-events-none" style={{ background: 'var(--terracotta)' }} />
          
          <div className="text-center mb-10 relative z-10">
            <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 shadow-lg transform transition-transform hover:scale-110" style={{ background: 'var(--grad-terra)' }}>
              <Sparkles size={24} color="white" />
            </Link>
            <h1 className="font-display text-3xl font-bold mb-3 tracking-tight" style={{ color: 'var(--charcoal)' }}>
              Welcome Back
            </h1>
            <p className="text-[15px]" style={{ color: 'var(--warm-gray)' }}>
              Sign in to continue your artisan journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest pl-1" style={{ color: 'var(--terracotta)' }}>Email Address</label>
              <input
                type="email"
                className="w-full px-5 py-4 rounded-xl text-[15px] outline-none transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(232, 217, 196, 0.6)', color: 'var(--charcoal)' }}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--terracotta)'; e.target.style.boxShadow = '0 0 0 4px rgba(193,105,58,0.1)' }}
                onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.7)'; e.target.style.borderColor = 'rgba(232, 217, 196, 0.6)'; e.target.style.boxShadow = 'none' }}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest pl-1" style={{ color: 'var(--terracotta)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="w-full px-5 py-4 pr-12 rounded-xl text-[15px] outline-none transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(232, 217, 196, 0.6)', color: 'var(--charcoal)' }}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--terracotta)'; e.target.style.boxShadow = '0 0 0 4px rgba(193,105,58,0.1)' }}
                  onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.7)'; e.target.style.borderColor = 'rgba(232, 217, 196, 0.6)'; e.target.style.boxShadow = 'none' }}
                  required
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} style={{ color: 'var(--warm-gray)' }} /> : <Eye size={18} style={{ color: 'var(--warm-gray)' }} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full justify-center text-base py-4 rounded-xl mt-4"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ArrowRight size={18} /> Continue to Gallery</>
              )}
            </motion.button>
          </form>

          {/* Secure Login Badge */}
          <div className="flex items-center justify-center gap-2 mt-8 opacity-60">
            <ShieldCheck size={14} style={{ color: 'var(--charcoal)' }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--charcoal)' }}>Secure Encrypted Login</span>
          </div>
        </div>

        {/* Sign Up Link Floating Below */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-white/80">
            New to Craftora?{' '}
            <Link to="/register" className="text-white font-bold hover:underline decoration-white/50 underline-offset-4 transition-all">
              Create a free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
