import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Send, Plus, Image, X } from 'lucide-react';
import { feedAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

function CreatePostModal({ onClose }) {
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileRef = useRef();
  const qc = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (fd) => feedAPI.createPost(fd),
    onSuccess: () => {
      qc.invalidateQueries(['feed']);
      toast.success('Post shared! 🎨');
      onClose();
    },
    onError: () => toast.error('Failed to create post'),
  });

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 5);
    setFiles(chosen);
    setPreviews(chosen.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption && files.length === 0) { toast.error('Add a caption or image'); return; }
    const fd = new FormData();
    fd.append('caption', caption);
    files.forEach((f) => fd.append('images', f));
    mutate(fd);
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg rounded-3xl p-6"
        style={{ background: 'var(--cream)' }}
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>Share Your Craft</h3>
          <button className="btn-ghost p-2 rounded-xl" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="input-field resize-none h-28 text-sm"
            placeholder="Tell the story behind this piece…"
            value={caption} onChange={(e) => setCaption(e.target.value)}
          />

          {previews.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {previews.map((p, i) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" className="btn-ghost flex items-center gap-2 text-sm"
              onClick={() => fileRef.current?.click()}>
              <Image size={16} style={{ color: 'var(--terracotta)' }} /> Add Photos
            </button>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
            <button type="submit" className="btn-primary ml-auto text-sm py-2.5 px-5" disabled={isLoading}>
              {isLoading ? '…' : <><Send size={15} /> Share</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function FeedCard({ post, onLike }) {
  const { user } = useAuthStore();
  const liked = post.likes?.includes(user?._id);

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
    >
      {/* Images */}
      {post.images?.length > 0 && (
        <div className="aspect-square overflow-hidden">
          <img src={post.images[0].url} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
        </div>
      )}

      <div className="p-5">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.author?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'A')}&background=C1693A&color=fff&size=80&bold=true`}
            alt="" className="w-9 h-9 rounded-xl object-cover"
            onError={(e) => { e.target.onerror=null; e.target.src='https://ui-avatars.com/api/?name=A&background=C1693A&color=fff&size=80'; }}
          />
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>
              {post.author?.name}
              {post.author?.isVerified && <span className="ml-1 text-xs" style={{ color: 'var(--terracotta)' }}>✓</span>}
            </p>
            <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--charcoal)' }}>{post.caption}</p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(193,105,58,0.1)', color: 'var(--terracotta)' }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--sand)' }}>
          <motion.button
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: liked ? 'var(--terracotta)' : 'var(--warm-gray)' }}
            onClick={() => onLike(post._id)}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
          >
            <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
            {post.likesCount || 0}
          </motion.button>
          <button className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--warm-gray)' }}>
            <MessageCircle size={17} />
            {post.comments?.length || 0}
          </button>
          {post.product && (
            <a href={`/products/${post.product._id || post.product}`} className="ml-auto text-xs font-medium hover:underline" style={{ color: 'var(--terracotta)' }}>
              View Product →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeedPage() {
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['feed', page],
    queryFn: () => feedAPI.getPosts(page).then((r) => r.data),
  });

  const { mutate: like } = useMutation({
    mutationFn: (id) => feedAPI.toggleLike(id),
    onSuccess: () => qc.invalidateQueries(['feed']),
  });

  const posts = data?.posts || [];

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="section-eyebrow">Community</span>
            <h1 className="font-display text-4xl font-bold" style={{ color: 'var(--charcoal)' }}>
              Live Craft <span style={{ color: 'var(--terracotta)' }}>Feed</span>
            </h1>
          </div>
          {user?.role === 'seller' && (
            <motion.button className="btn-primary flex items-center gap-2"
              onClick={() => setShowCreate(true)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              <Plus size={18} /> Share a Craft
            </motion.button>
          )}
        </div>

        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl mb-6" style={{ height: `${240 + i * 40}px` }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--charcoal)' }}>The feed is empty</h2>
            <p style={{ color: 'var(--warm-gray)' }}>Artisans haven't posted yet. Check back soon!</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {posts.map((post) => (
              <div key={post._id} className="masonry-item">
                <FeedCard post={post} onLike={like} />
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {posts.length >= 10 && (
          <div className="text-center mt-10">
            <button className="btn-outline px-10" onClick={() => setPage((p) => p + 1)}>Load More</button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
