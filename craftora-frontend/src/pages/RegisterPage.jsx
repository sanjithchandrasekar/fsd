import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, User, ShoppingBag, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/craftora_hero_1777297935332.png" 
          alt="Artisan Background" 
          className="w-full h-full object-cover scale-105" 
          style={{ filter: 'brightness(0.5) saturate(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1512]/90 via-[#2C2522]/40 to-transparent mix-blend-multiply" />
      </div>

      <motion.div
        className="w-full max-w-[500px] relative z-10 mx-4"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Floating Glass Card */}
        <div 
          className="rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          style={{ 
            background: 'rgba(250, 246, 241, 0.92)', 
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2" style={{ background: 'var(--terracotta)' }} />
          
          <div className="text-center mb-8 relative z-10">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-lg transform transition-transform hover:scale-110" style={{ background: 'var(--grad-terra)' }}>
              <Sparkles size={20} color="white" />
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2 tracking-tight" style={{ color: 'var(--charcoal)' }}>
              Join the Gallery
            </h1>
            <p className="text-sm md:text-[15px]" style={{ color: 'var(--warm-gray)' }}>
              Create your account to curate and collect.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {[
                { value: 'buyer', label: 'Collector', icon: <ShoppingBag size={18} /> },
                { value: 'seller', label: 'Artisan', icon: <User size={18} /> },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-[1.25rem] transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: form.role === value ? 'rgba(193,105,58,0.1)' : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${form.role === value ? 'var(--terracotta)' : 'rgba(232, 217, 196, 0.6)'}`,
                    color: form.role === value ? 'var(--terracotta)' : 'var(--warm-gray)'
                  }}
                  onClick={() => setForm({ ...form, role: value })}
                >
                  {form.role === value && <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />}
                  {icon}
                  <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest pl-1" style={{ color: 'var(--terracotta)' }}>Full Name</label>
              <input
                className="w-full px-5 py-3.5 rounded-xl text-[15px] outline-none transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(232, 217, 196, 0.6)', color: 'var(--charcoal)' }}
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--terracotta)'; e.target.style.boxShadow = '0 0 0 4px rgba(193,105,58,0.1)' }}
                onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.7)'; e.target.style.borderColor = 'rgba(232, 217, 196, 0.6)'; e.target.style.boxShadow = 'none' }}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-widest pl-1" style={{ color: 'var(--terracotta)' }}>Email Address</label>
              <input
                type="email"
                className="w-full px-5 py-3.5 rounded-xl text-[15px] outline-none transition-all duration-300"
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
                  className="w-full px-5 py-3.5 pr-12 rounded-xl text-[15px] outline-none transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(232, 217, 196, 0.6)', color: 'var(--charcoal)' }}
                  placeholder="At least 6 characters"
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
              className="btn-primary w-full justify-center text-base py-4 rounded-xl mt-6"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Sparkles size={18} /> Create Account</>
              )}
            </motion.button>
          </form>

          {/* Secure Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 opacity-60">
            <ShieldCheck size={14} style={{ color: 'var(--charcoal)' }} />
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--charcoal)' }}>Your data is securely encrypted</span>
          </div>
        </div>

        {/* Floating Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-white/80">
            Already a member?{' '}
            <Link to="/login" className="text-white font-bold hover:underline decoration-white/50 underline-offset-4 transition-all">
              Sign in to your account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
