import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Heart, User, Menu, X, Sun, Moon,
  Search, MessageCircle, ChevronDown, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';
import { productAPI } from '../../services/api';
import { debounce } from '../../utils/helpers';

const CATEGORIES = ['Jewelry', 'Pottery', 'Paintings', 'Decor', 'Textiles', 'Sculpture', 'Woodwork'];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchSuggestions = debounce(async (q) => {
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const { data } = await productAPI.searchSuggestions(q);
      setSuggestions(data.suggestions || []);
    } catch { setSuggestions([]); }
  }, 300);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchSuggestions(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Collection', hasDropdown: true },
    { to: '/artisans', label: 'Artisans' },
    { to: '/feed', label: 'Journal' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <>
      {location.pathname !== '/' && <div className="h-24" />}
      <motion.nav
        className={`fixed z-50 transition-all duration-500 ease-out ${
          scrolled 
            ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl py-3 px-6 rounded-full border border-gray-200/50 dark:border-gray-800/50' 
            : 'top-0 left-0 w-full bg-transparent py-6 px-6 lg:px-12'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <div className="flex items-center justify-between w-full relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group z-10">
            <motion.div
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-900 text-white shadow-xl group-hover:shadow-yellow-500/20"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <Sparkles size={20} className="text-yellow-400" />
            </motion.div>
            <span className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Craft<span className="text-yellow-600">ora</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Centered) */}
          <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <div key={link.to} className="relative group">
                  {link.hasDropdown ? (
                    <button
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full font-medium text-sm transition-all relative overflow-hidden ${
                        categoriesOpen ? 'text-yellow-600' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      onMouseEnter={() => setCategoriesOpen(true)}
                      onMouseLeave={() => setCategoriesOpen(false)}
                    >
                      <span className="relative z-10">{link.label}</span>
                      <ChevronDown size={14} className={`transition-transform duration-300 relative z-10 ${categoriesOpen ? 'rotate-180' : ''}`} />
                      {categoriesOpen && (
                        <motion.div layoutId="nav-pill" className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full z-0" />
                      )}
                    </button>
                  ) : (
                    <NavLink
                      to={link.to}
                      className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all relative overflow-hidden flex items-center justify-center ${
                        isActive ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div layoutId="nav-pill" className="absolute inset-0 bg-yellow-50 dark:bg-yellow-900/20 rounded-full z-0" />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </NavLink>
                  )}

                  {/* Categories Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {categoriesOpen && (
                        <motion.div
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => setCategoriesOpen(true)}
                          onMouseLeave={() => setCategoriesOpen(false)}
                        >
                          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-gray-100 dark:border-gray-800 w-[400px] grid grid-cols-2 gap-2 relative">
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 dark:bg-gray-900/95 rotate-45 border-l border-t border-gray-100 dark:border-gray-800" />
                            {CATEGORIES.map((cat) => (
                              <Link
                                key={cat}
                                to={`/shop?category=${cat}`}
                                className="px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:bg-yellow-50 dark:hover:bg-white/5 hover:text-yellow-700 dark:hover:text-yellow-400 text-gray-700 dark:text-gray-300 relative z-10 flex items-center gap-2"
                                onClick={() => setCategoriesOpen(false)}
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {cat}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1.5 md:gap-3 z-10">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <motion.button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                onClick={() => setSearchOpen(!searchOpen)}
                whileTap={{ scale: 0.9 }}
              >
                {searchOpen ? <X size={20} /> : <Search size={20} />}
              </motion.button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-4 w-[90vw] sm:w-[400px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-gray-100 dark:border-gray-800"
                    initial={{ opacity: 0, scale: 0.9, y: 10, transformOrigin: 'top right' }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          className="w-full bg-gray-100 dark:bg-black/50 text-gray-900 dark:text-white text-sm rounded-full pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                          placeholder="Search artisans, styles, or items..."
                          value={searchQuery}
                          onChange={handleSearch}
                          autoFocus
                        />
                      </div>
                    </form>
                    {suggestions.length > 0 && (
                      <div className="mt-4 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                        {suggestions.map((s) => (
                          <button
                            key={s.id}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group"
                            onClick={() => {
                              navigate(`/products/${s.id}`);
                              setSearchOpen(false);
                            }}
                          >
                            <span className="font-medium text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors">{s.label}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full">{s.category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <motion.button
              className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist">
                <motion.button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-gray-700 dark:text-gray-300 relative group" whileTap={{ scale: 0.9 }}>
                  <Heart size={20} className="group-hover:fill-red-500" />
                  {user.wishlist?.length > 0 && (
                    <span className="absolute 1 top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-white dark:border-gray-900 shadow-sm">
                      {user.wishlist.length}
                    </span>
                  )}
                </motion.button>
              </Link>
            )}

            {/* Cart */}
            <motion.button
              className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all relative"
              onClick={toggleCart}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-gray-900 rounded-full text-[11px] flex items-center justify-center font-bold border-2 border-white dark:border-gray-900 shadow-sm"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {/* Profile */}
            {user ? (
              <div ref={profileRef} className="relative ml-1 hidden sm:block">
                <motion.button
                  className="flex items-center justify-center w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-yellow-600 hover:shadow-lg transition-all"
                  onClick={() => setProfileOpen(!profileOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900" />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-900 text-white text-sm font-bold border-2 border-white dark:border-gray-900">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-4 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-gray-100 dark:border-gray-800"
                      initial={{ opacity: 0, scale: 0.9, y: 10, transformOrigin: 'top right' }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-3 mb-2 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {[
                          { to: '/profile', label: 'My Profile', icon: User },
                          { to: '/orders', label: 'My Orders', icon: ShoppingBag },
                          { to: '/wishlist', label: 'Wishlist', icon: Heart },
                          ...(user.role === 'seller' ? [{ to: '/seller/dashboard', label: 'Seller Dashboard', icon: Sparkles }] : []),
                          ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel', icon: User }] : []),
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
                              onClick={() => setProfileOpen(false)}
                            >
                              <Icon size={16} className="text-gray-400" />
                              {item.label}
                            </Link>
                          );
                        })}
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                          onClick={handleLogout}
                        >
                          <X size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="ml-2 hidden sm:block">
                <motion.button className="bg-yellow-500 text-gray-900 font-bold text-sm py-2.5 px-6 rounded-full hover:bg-yellow-600 transition-colors shadow-lg shadow-yellow-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Sign In
                </motion.button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white ml-1" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Fullscreen Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 top-[88px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl z-40 lg:hidden overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-8 py-8 space-y-4">
                {navLinks.map((link) => (
                  <div key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) => `block text-3xl font-display font-bold mb-4 transition-colors ${isActive ? 'text-yellow-600' : 'text-gray-900 dark:text-white'}`}
                      onClick={() => !link.hasDropdown && setMobileOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                    {link.hasDropdown && (
                      <div className="grid grid-cols-2 gap-4 pl-4 mb-8">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat}
                            to={`/shop?category=${cat}`}
                            className="text-lg text-gray-600 dark:text-gray-400 font-medium py-2 flex items-center gap-2"
                            onClick={() => setMobileOpen(false)}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                            {cat}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {user ? (
                  <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
                     <Link to="/profile" className="block text-xl font-bold text-gray-900 dark:text-white" onClick={() => setMobileOpen(false)}>My Profile</Link>
                     <Link to="/orders" className="block text-xl font-bold text-gray-900 dark:text-white" onClick={() => setMobileOpen(false)}>My Orders</Link>
                     {user.role === 'seller' && <Link to="/seller/dashboard" className="block text-xl font-bold text-yellow-600" onClick={() => setMobileOpen(false)}>Seller Dashboard</Link>}
                     {user.role === 'admin' && <Link to="/admin" className="block text-xl font-bold text-yellow-600" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
                     <button className="text-xl font-bold text-red-500 pt-4" onClick={handleLogout}>Sign Out</button>
                  </div>
                ) : (
                  <Link to="/login" className="block pt-8 mt-8 border-t border-gray-100 dark:border-gray-800" onClick={() => setMobileOpen(false)}>
                    <button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg py-4 rounded-2xl">
                      Sign In / Register
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
