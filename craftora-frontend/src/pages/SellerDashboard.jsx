import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit3, Trash2, Package, TrendingUp, Star, Eye, X, Upload } from 'lucide-react';
import { productAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatPrice, formatDate, categoryMeta } from '../utils/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = Object.keys(categoryMeta);

function ProductFormModal({ product, onClose }) {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const fileRef = useRef();
  const isEdit = !!product;

  const [form, setForm] = useState({
    title: product?.title || '',
    description: product?.description || '',
    story: product?.story || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    category: product?.category || CATEGORIES[0],
    stock: product?.stock || 1,
    isSustainable: product?.isSustainable || false,
    isCustomizable: product?.isCustomizable || false,
    processingTime: product?.processingTime || '3-5 business days',
    tags: product?.tags?.join(', ') || '',
    materials: product?.materials?.join(', ') || '',
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState(product?.images?.map((i) => i.url) || []);
  const [saving, setSaving] = useState(false);

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 8);
    setFiles(chosen);
    setPreviews(chosen.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.category) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append('images', f));
      if (isEdit) {
        await productAPI.update(product._id, fd);
        toast.success('Product updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Product submitted for review!');
      }
      qc.invalidateQueries(['seller-products']);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-2xl rounded-3xl p-8 my-4"
        style={{ background: 'var(--cream)' }}
        initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--charcoal)' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button className="btn-ghost p-2 rounded-xl" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Images */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>
              Product Images (max 8)
            </label>
            <div className="flex gap-3 flex-wrap mb-3">
              {previews.map((p, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <button type="button"
                className="w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all hover:border-terracotta"
                style={{ borderColor: 'var(--sand)', color: 'var(--warm-gray)' }}
                onClick={() => fileRef.current?.click()}>
                <Upload size={18} /> Upload
              </button>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Title *</label>
              <input className="input-field" placeholder="Beautiful handcrafted…" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Description *</label>
              <textarea className="input-field resize-none h-24 text-sm" placeholder="Describe your product…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Story (optional)</label>
              <textarea className="input-field resize-none h-20 text-sm" placeholder="The story behind this piece…" value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Price (₹) *</label>
              <input type="number" className="input-field" placeholder="999" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Discount Price (₹)</label>
              <input type="number" className="input-field" placeholder="Optional" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Category *</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{categoryMeta[c]?.emoji} {c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Stock Quantity</label>
              <input type="number" className="input-field" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Tags (comma-separated)</label>
              <input className="input-field text-sm" placeholder="handmade, pottery, blue" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Materials</label>
              <input className="input-field text-sm" placeholder="Clay, glaze, wood" value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--terracotta)' }}>Processing Time</label>
              <input className="input-field text-sm" placeholder="3-5 business days" value={form.processingTime} onChange={(e) => setForm({ ...form, processingTime: e.target.value })} />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[
              { key: 'isSustainable', label: '🌱 Eco-Friendly' },
              { key: 'isCustomizable', label: '✨ Customizable' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-10 h-5 rounded-full relative transition-all"
                  style={{ background: form[key] ? 'var(--terracotta)' : 'var(--sand)' }}
                  onClick={() => setForm({ ...form, [key]: !form[key] })}
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
                    style={{ left: form[key] ? '22px' : '2px' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <motion.button type="submit" className="btn-primary flex-1 justify-center py-3" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isEdit ? 'Update Product' : 'Submit for Review'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['seller-products', user?._id],
    queryFn: () => productAPI.getSellerProducts(user._id).then((r) => r.data),
    enabled: !!user,
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => productAPI.delete(id),
    onSuccess: () => { qc.invalidateQueries(['seller-products']); toast.success('Product deleted'); },
    onError: () => toast.error('Delete failed'),
  });

  const products = data?.products || [];
  const approved = products.filter((p) => p.status === 'approved').length;
  const pending = products.filter((p) => p.status === 'pending').length;
  const totalRevenue = products.filter((p) => p.status === 'approved').reduce((s, p) => s + (p.price * p.totalSales), 0);

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
          <div>
            <span className="section-eyebrow">Seller Hub</span>
            <h1 className="font-display text-4xl font-bold" style={{ color: 'var(--charcoal)' }}>
              My <span style={{ color: 'var(--terracotta)' }}>Dashboard</span>
            </h1>
          </div>
          <motion.button className="btn-primary" onClick={() => { setEditProduct(null); setShowForm(true); }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Plus size={18} /> Add Product
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Total Products', value: products.length, icon: <Package size={20} />, color: '#C1693A' },
            { label: 'Approved', value: approved, icon: <Eye size={20} />, color: '#7A9E7E' },
            { label: 'Pending Review', value: pending, icon: <Star size={20} />, color: '#F59E0B' },
            { label: 'Est. Revenue', value: formatPrice(totalRevenue), icon: <TrendingUp size={20} />, color: '#8B5CF6' },
          ].map((s, i) => (
            <motion.div key={s.label} className="glass-card p-5"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}18` }}>
                <div style={{ color: s.color }}>{s.icon}</div>
              </div>
              <p className="font-display text-2xl font-bold" style={{ color: 'var(--charcoal)' }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--warm-gray)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Products Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: 'var(--sand)' }}>
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>My Products</h2>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl mb-2" style={{ color: 'var(--charcoal)' }}>No products yet</p>
              <p className="mb-6 text-sm" style={{ color: 'var(--warm-gray)' }}>Start adding your handcrafted creations!</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add First Product</button>
            </div>
          ) : (
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
              {products.map((p, i) => (
                <motion.div key={p._id}
                  className="flex items-center gap-4 p-4 hover:bg-parchment transition-colors"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <img
                    src={p.images?.[0]?.url || 'https://placehold.co/56x56/F2EBE0/C1693A?text=P'}
                    alt={p.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--charcoal)' }}>{p.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--warm-gray)' }}>{p.category} · {p.stock} in stock</p>
                  </div>
                  <div className="hidden sm:block text-center">
                    <p className="font-bold text-sm" style={{ color: 'var(--terracotta)' }}>{formatPrice(p.discountPrice || p.price)}</p>
                    <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{p.totalSales} sold</p>
                  </div>
                  <span className={`badge hidden md:inline-flex ${
                    p.status === 'approved' ? 'badge-sage' :
                    p.status === 'pending' ? 'badge-terra' : 'badge-dark'
                  }`} style={p.status === 'pending' ? { background: 'rgba(245,158,11,0.15)', color: '#D97706' } : {}}>
                    {p.status}
                  </span>
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: 'rgba(193,105,58,0.1)', color: 'var(--terracotta)' }}
                      onClick={() => { setEditProduct(p); setShowForm(true); }}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                      <Edit3 size={14} />
                    </motion.button>
                    <motion.button
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                      onClick={() => { if (confirm('Delete this product?')) deleteProduct.mutate(p._id); }}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <ProductFormModal
            product={editProduct}
            onClose={() => { setShowForm(false); setEditProduct(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
