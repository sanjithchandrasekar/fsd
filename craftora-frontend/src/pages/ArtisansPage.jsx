import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Trophy, BadgeCheck } from 'lucide-react';
import { adminAPI } from '../services/api';

export default function ArtisansPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => adminAPI.getLeaderboard().then((r) => r.data),
  });

  const artisans = data?.artisans || [];

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <div className="relative py-20 mb-12 overflow-hidden" style={{ background: 'var(--grad-hero)' }}>
        <div className="blob w-80 h-80 -top-20 -left-20 opacity-20" style={{ background: 'var(--terracotta)' }} />
        <div className="blob w-64 h-64 bottom-0 right-0 opacity-15" style={{ background: 'var(--sage)', animationDelay: '4s' }} />
        <div className="section-container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-eyebrow" style={{ color: 'var(--terracotta-lt)' }}>The Makers</span>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Meet Our Artisans</h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(242,235,224,0.7)' }}>
              Real people with extraordinary skills — each artisan carries a tradition, a story, and a lifelong passion.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', fill: 'var(--cream)', height: '60px' }}>
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" />
          </svg>
        </div>
      </div>

      <div className="section-container">
        {/* Leaderboard top 3 */}
        {!isLoading && artisans.length >= 3 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Trophy size={22} style={{ color: 'var(--terracotta)' }} />
              <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--charcoal)' }}>Top Artisans This Month</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {artisans.slice(0, 3).map((a, i) => (
                <motion.div
                  key={a._id}
                  className="relative glass-card p-8 text-center"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ order: i === 0 ? 1 : i === 1 ? 0 : 2 }}
                >
                  {/* Rank badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg"
                    style={{ background: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : '#CD7F32' }}>
                    {['🥇','🥈','🥉'][i]}
                  </div>

                  <img
                    src={a.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=C1693A&color=fff&size=128&bold=true&rounded=true`}
                    alt={a.name}
                    className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 mt-2"
                    onError={(e) => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${a.name[0]}&background=C1693A&color=fff&size=128`; }}
                  />
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--charcoal)' }}>{a.name}</h3>
                    {a.isVerified && <BadgeCheck size={16} style={{ color: 'var(--terracotta)' }} />}
                  </div>
                  {a.location?.city && (
                    <p className="text-xs mb-4 flex items-center justify-center gap-1" style={{ color: 'var(--warm-gray)' }}>
                      <MapPin size={10} /> {a.location.city}
                    </p>
                  )}
                  <div className="flex justify-center gap-6 mb-5">
                    <div>
                      <p className="font-bold text-lg" style={{ color: 'var(--terracotta)' }}>{a.totalSales}</p>
                      <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>Sales</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg flex items-center gap-1" style={{ color: 'var(--terracotta)' }}>
                        <Star size={14} fill="currentColor" />{a.averageRating?.toFixed(1)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>Rating</p>
                    </div>
                  </div>
                  <Link to={`/artisans/${a._id}`}>
                    <button className="btn-primary text-sm py-2.5 w-full justify-center">View Profile</button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All artisans grid */}
        <div>
          <h2 className="font-display text-2xl font-semibold mb-8" style={{ color: 'var(--charcoal)' }}>All Artisans</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artisans.map((a, i) => (
                <motion.div
                  key={a._id}
                  className="glass-card p-5 text-center"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <img
                    src={a.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=C1693A&color=fff&size=80&bold=true&rounded=true`}
                    alt={a.name}
                    className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3"
                    onError={(e) => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${a.name[0]}&background=C1693A&color=fff&size=80`; }}
                  />
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{a.name}</h3>
                    {a.isVerified && <BadgeCheck size={13} style={{ color: 'var(--terracotta)' }} />}
                  </div>
                  {a.location?.city && (
                    <p className="text-xs mb-2 flex items-center justify-center gap-1" style={{ color: 'var(--warm-gray)' }}>
                      <MapPin size={9} /> {a.location.city}
                    </p>
                  )}
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--warm-gray)' }}>{a.bio || 'Passionate artisan'}</p>
                  <div className="flex justify-center gap-4 mb-4">
                    <div>
                      <p className="font-bold text-sm" style={{ color: 'var(--terracotta)' }}>{a.totalSales}</p>
                      <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>Sales</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm flex items-center gap-0.5" style={{ color: 'var(--terracotta)' }}>
                        <Star size={10} fill="currentColor" />{a.averageRating?.toFixed(1)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>Rating</p>
                    </div>
                  </div>
                  <Link to={`/artisans/${a._id}`}>
                    <button className="btn-outline text-xs py-2 w-full">View Profile</button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
