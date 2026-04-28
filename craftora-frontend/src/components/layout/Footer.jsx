import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Heart } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const footerLinks = {
  Shop: [
    { label: 'Jewelry', to: '/shop?category=Jewelry' },
    { label: 'Pottery', to: '/shop?category=Pottery' },
    { label: 'Paintings', to: '/shop?category=Paintings' },
    { label: 'Textiles', to: '/shop?category=Textiles' },
    { label: 'Decor', to: '/shop?category=Decor' },
  ],
  Discover: [
    { label: 'Meet Artisans', to: '/artisans' },
    { label: 'Craft Feed', to: '/feed' },
    { label: 'Leaderboard', to: '/leaderboard' },
    { label: 'Custom Orders', to: '/custom-orders' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Become a Seller', to: '/become-seller' },
    { label: 'Sustainability', to: '/sustainability' },
    { label: 'Contact', to: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-32 pb-12 mt-20" style={{ background: 'var(--charcoal)' }}>
      {/* Decorative blobs */}
      <div className="blob w-96 h-96 -top-20 -left-20" style={{ background: 'var(--terracotta)' }} />
      <div className="blob w-64 h-64 bottom-10 right-10" style={{ background: 'var(--clay)' }} />

      <div className="section-container relative z-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--grad-terra)' }}>
                <Sparkles size={20} color="white" />
              </div>
              <span className="font-display text-3xl font-bold text-white">
                Craft<span style={{ color: 'var(--terracotta-lt)' }}>ora</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--warm-gray)' }}>
              A digital sanctuary for handcrafted stories. Every piece carries the soul of its maker — discover art you can hold.
            </p>
            <div className="flex gap-4">
              <motion.a href="#" whileHover={{ scale: 1.1, color: 'var(--terracotta)' }} className="transition-colors" style={{ color: 'var(--warm-gray)' }}>
                <FaInstagram size={20} />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.1, color: 'var(--terracotta)' }} className="transition-colors" style={{ color: 'var(--warm-gray)' }}>
                <FaFacebook size={20} />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.1, color: 'var(--terracotta)' }} className="transition-colors" style={{ color: 'var(--warm-gray)' }}>
                <Globe size={20} />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm uppercase tracking-widest mb-5" style={{ color: 'var(--terracotta-lt)' }}>
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'var(--warm-gray)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass rounded-[2rem] p-10 md:p-14 mb-16 shadow-2xl" style={{ borderColor: 'rgba(193,105,58,0.2)' }}>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h3 className="font-display text-3xl font-bold text-white mb-3">Stay Inspired</h3>
              <p className="text-base" style={{ color: 'var(--warm-gray)' }}>Get artisan stories & new arrivals directly to your inbox.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="input-field flex-1 md:w-64"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(193,105,58,0.25)', color: 'white' }}
              />
              <button className="btn-primary whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>
            © {new Date().getFullYear()} Craftora. Handcrafted with <Heart size={11} className="inline text-red-400" /> for artisans worldwide.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((t) => (
              <Link key={t} to="#" className="text-xs hover:text-white transition-colors" style={{ color: 'var(--warm-gray)' }}>{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
