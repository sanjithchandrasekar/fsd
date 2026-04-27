import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search, Leaf, Wand2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { categoryMeta, debounce } from '../utils/helpers';

const CATEGORIES = Object.keys(categoryMeta);
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '',
    minRating: '',
    isSustainable: searchParams.get('isSustainable') === 'true',
    isCustomizable: false,
    sort: 'createdAt',
  });

  // Sync search param changes
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
    }));
    setPage(1);
  }, [searchParams]);

  const queryParams = {
    page, limit: 12,
    ...(filters.search && { search: filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    ...(filters.minRating && { minRating: filters.minRating }),
    ...(filters.isSustainable && { isSustainable: 'true' }),
    ...(filters.isCustomizable && { isCustomizable: 'true' }),
    sort: filters.sort,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productAPI.getAll(queryParams).then((r) => r.data),
    keepPreviousData: true,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {};

  const updateFilter = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', minRating: '', isSustainable: false, isCustomizable: false, sort: 'createdAt' });
    setSearchParams({});
    setPage(1);
  };

  const activeFiltersCount = [
    filters.category, filters.minPrice, filters.maxPrice,
    filters.minRating, filters.isSustainable, filters.isCustomizable
  ].filter(Boolean).length;

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container">
        {/* Header */}
        <div className="mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-eyebrow">The Marketplace</span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h1 className="section-title text-left" style={{ marginBottom: 0 }}>
                {filters.category || 'All'} <span className="text-gradient">Crafts</span>
              </h1>
              <p className="text-sm" style={{ color: 'var(--warm-gray)' }}>
                {pagination.total || 0} handcrafted items
              </p>
            </div>
          </motion.div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--warm-gray)' }} />
            <input
              className="input-field pl-10 text-sm"
              placeholder="Search products…"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              className="input-field text-sm pr-8 appearance-none cursor-pointer"
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--warm-gray)' }} />
          </div>

          {/* Filter button */}
          <motion.button
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${filtersOpen ? 'bg-terracotta text-white' : 'btn-outline'}`}
            style={filtersOpen ? { background: 'var(--terracotta)', color: '#fff', border: 'none' } : {}}
            onClick={() => setFiltersOpen(!filtersOpen)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold" style={{ color: 'var(--terracotta)' }}>
                {activeFiltersCount}
              </span>
            )}
          </motion.button>

          {activeFiltersCount > 0 && (
            <button className="text-sm flex items-center gap-1 hover:text-red-500 transition-colors" style={{ color: 'var(--warm-gray)' }} onClick={clearFilters}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['', ...CATEGORIES].map((cat) => (
            <motion.button
              key={cat || 'all'}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={filters.category === cat
                ? { background: 'var(--terracotta)', color: '#fff' }
                : { background: 'var(--parchment)', color: 'var(--warm-gray)', border: '1px solid var(--sand)' }
              }
              onClick={() => updateFilter('category', cat)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              {cat ? `${categoryMeta[cat]?.emoji} ${cat}` : '🌟 All'}
            </motion.button>
          ))}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              className="glass rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            >
              {/* Price range */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Price Range (₹)</label>
                <div className="flex gap-2">
                  <input type="number" className="input-field text-sm" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} />
                  <input type="number" className="input-field text-sm" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
                </div>
              </div>

              {/* Min rating */}
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Min Rating</label>
                <select className="input-field text-sm" value={filters.minRating} onChange={(e) => updateFilter('minRating', e.target.value)}>
                  <option value="">Any Rating</option>
                  {[4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}+ Stars</option>)}
                </select>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3">
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Special</label>
                {[
                  { key: 'isSustainable', icon: <Leaf size={14} />, label: 'Eco-Friendly' },
                  { key: 'isCustomizable', icon: <Wand2 size={14} />, label: 'Customizable' },
                ].map(({ key, icon, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className="w-9 h-5 rounded-full transition-all relative"
                      style={{ background: filters[key] ? 'var(--terracotta)' : 'var(--sand)' }}
                      onClick={() => updateFilter(key, !filters[key])}
                    >
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow"
                        style={{ left: filters[key] ? '18px' : '2px' }} />
                    </div>
                    <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--charcoal)' }}>{icon}{label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--charcoal)' }}>No products found</h3>
            <p className="mb-6" style={{ color: 'var(--warm-gray)' }}>Try adjusting your filters or search term.</p>
            <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <motion.button
                key={i}
                className="w-10 h-10 rounded-xl font-semibold text-sm transition-all"
                style={page === i + 1
                  ? { background: 'var(--terracotta)', color: '#fff' }
                  : { background: 'var(--parchment)', color: 'var(--warm-gray)', border: '1px solid var(--sand)' }
                }
                onClick={() => setPage(i + 1)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
