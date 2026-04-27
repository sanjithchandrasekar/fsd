import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Camera, Edit3, Save, MapPin, Link as LinkIcon, Star, Package } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { productAPI, authAPI } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    artisanStory: user?.artisanStory || '',
    city: user?.location?.city || '',
    country: user?.location?.country || '',
    instagram: user?.socialLinks?.instagram || '',
    website: user?.socialLinks?.website || '',
  });

  const { data: productsData } = useQuery({
    queryKey: ['seller-products', user?._id],
    queryFn: () => productAPI.getSellerProducts(user._id).then((r) => r.data),
    enabled: user?.role === 'seller',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('bio', form.bio);
      payload.append('artisanStory', form.artisanStory);
      payload.append('location', JSON.stringify({ city: form.city, country: form.country }));
      payload.append('socialLinks', JSON.stringify({ instagram: form.instagram, website: form.website }));
      const { data } = await authAPI.updateProfile(payload);
      updateUser(data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container max-w-4xl">
        {/* Profile card */}
        <motion.div
          className="glass-card p-8 mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={user.avatar?.url || `https://placehold.co/120x120/F2EBE0/C1693A?text=${user.name[0]}`}
                alt={user.name}
                className="w-28 h-28 rounded-2xl object-cover"
              />
              {editing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
                  style={{ background: 'var(--terracotta)' }}>
                  <Camera size={14} color="white" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input className="input-field text-lg font-semibold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <textarea className="input-field resize-none h-20 text-sm" placeholder="Short bio…" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                  {user.role === 'seller' && (
                    <textarea className="input-field resize-none h-32 text-sm" placeholder="Your artisan story…" value={form.artisanStory} onChange={(e) => setForm({ ...form, artisanStory: e.target.value })} />
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field text-sm" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <input className="input-field text-sm" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                    <input className="input-field text-sm" placeholder="Instagram URL" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
                    <input className="input-field text-sm" placeholder="Website URL" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--charcoal)' }}>{user.name}</h1>
                    <span className="badge badge-terra capitalize">{user.role}</span>
                    {user.isVerified && <span className="badge badge-sage">✓ Verified</span>}
                  </div>
                  {user.bio && <p className="mb-3 leading-relaxed" style={{ color: 'var(--warm-gray)' }}>{user.bio}</p>}
                  {user.artisanStory && (
                    <blockquote className="border-l-4 pl-4 italic text-sm mb-3 font-elegant"
                      style={{ borderColor: 'var(--terracotta)', color: 'var(--warm-gray)' }}>
                      "{user.artisanStory.slice(0, 200)}…"
                    </blockquote>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--warm-gray)' }}>
                    {user.location?.city && (
                      <span className="flex items-center gap-1"><MapPin size={13} /> {user.location.city}, {user.location.country}</span>
                    )}
                    {user.socialLinks?.instagram && (
                      <a href={user.socialLinks.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-terracotta">
                        <LinkIcon size={13} /> Instagram
                      </a>
                    )}
                    {user.socialLinks?.website && (
                      <a href={user.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-terracotta">
                        <LinkIcon size={13} /> Website
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Edit button */}
            <div className="flex gap-2">
              {editing ? (
                <>
                  <motion.button className="btn-primary text-sm py-2.5 px-5" onClick={handleSave} disabled={saving}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Save size={15} /> {saving ? 'Saving…' : 'Save'}
                  </motion.button>
                  <button className="btn-ghost text-sm" onClick={() => setEditing(false)}>Cancel</button>
                </>
              ) : (
                <motion.button className="btn-outline text-sm py-2.5 px-5" onClick={() => setEditing(true)}
                  whileHover={{ scale: 1.03 }}>
                  <Edit3 size={15} /> Edit Profile
                </motion.button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t" style={{ borderColor: 'var(--sand)' }}>
            {[
              { icon: <Package size={18} />, value: productsData?.products?.length || 0, label: 'Products' },
              { icon: <Star size={18} />, value: user.averageRating?.toFixed(1) || '—', label: 'Avg Rating' },
              { icon: <Package size={18} />, value: user.totalSales || 0, label: 'Total Sales' },
            ].map(({ icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-1" style={{ color: 'var(--terracotta)' }}>{icon}</div>
                <p className="font-bold text-xl font-display" style={{ color: 'var(--charcoal)' }}>{value}</p>
                <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Seller Products */}
        {user.role === 'seller' && productsData?.products?.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: 'var(--charcoal)' }}>My Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsData.products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
