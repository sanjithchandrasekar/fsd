import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Package, ShoppingBag, TrendingUp, CheckCircle, XCircle, Eye, BarChart2 } from 'lucide-react';
import { adminAPI } from '../services/api';
import { formatPrice, formatDate, orderStatusMeta } from '../utils/helpers';
import toast from 'react-hot-toast';

const TABS = ['Dashboard', 'Products', 'Users', 'Orders'];

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <p className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--charcoal)' }}>{value}</p>
      <p className="text-sm" style={{ color: 'var(--warm-gray)' }}>{label}</p>
    </motion.div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState('Dashboard');
  const qc = useQueryClient();

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminAPI.getAnalytics().then((r) => r.data),
    enabled: tab === 'Dashboard',
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminAPI.getProducts('pending').then((r) => r.data),
    enabled: tab === 'Products',
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers().then((r) => r.data),
    enabled: tab === 'Users',
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminAPI.getOrders().then((r) => r.data),
    enabled: tab === 'Orders',
  });

  const approveProduct = useMutation({
    mutationFn: ({ id, status }) => adminAPI.updateProductStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Product status updated'); },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }) => adminAPI.updateUser(id, data),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('User updated'); },
  });

  const stats = analytics?.stats || {};

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="section-eyebrow">Administration</span>
          <h1 className="font-display text-4xl font-bold" style={{ color: 'var(--charcoal)' }}>Admin Panel</h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: 'var(--sand)' }}>
          {TABS.map((t) => (
            <button
              key={t}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px`}
              style={{ borderColor: tab === t ? 'var(--terracotta)' : 'transparent', color: tab === t ? 'var(--terracotta)' : 'var(--warm-gray)' }}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Dashboard */}
          {tab === 'Dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatCard icon={<Users size={22} />} label="Total Users" value={stats.totalUsers || 0} color="#C1693A" delay={0} />
                <StatCard icon={<Package size={22} />} label="Total Products" value={stats.totalProducts || 0} color="#7A9E7E" delay={0.1} />
                <StatCard icon={<ShoppingBag size={22} />} label="Total Orders" value={stats.totalOrders || 0} color="#8B5CF6" delay={0.2} />
                <StatCard icon={<TrendingUp size={22} />} label="Revenue" value={formatPrice(stats.totalRevenue || 0)} color="#F59E0B" delay={0.3} />
              </div>

              {/* Pending products */}
              {stats.pendingProducts > 0 && (
                <div className="glass-card p-6 mb-6">
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--charcoal)' }}>
                    ⚠️ {stats.pendingProducts} product{stats.pendingProducts > 1 ? 's' : ''} awaiting approval
                  </h3>
                  <button className="btn-primary text-sm py-2 px-5" onClick={() => setTab('Products')}>Review Now</button>
                </div>
              )}

              {/* Top sellers */}
              {analytics?.topSellers?.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold mb-5" style={{ color: 'var(--charcoal)' }}>Top Sellers</h3>
                  <div className="space-y-4">
                    {analytics.topSellers.map((s, i) => (
                      <div key={s._id} className="flex items-center gap-4">
                        <span className="w-6 text-center font-bold text-sm" style={{ color: 'var(--warm-gray)' }}>#{i + 1}</span>
                        <img src={s.avatar?.url || `https://placehold.co/40x40/F2EBE0/C1693A?text=${s.name[0]}`}
                          alt="" className="w-9 h-9 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ color: 'var(--charcoal)' }}>{s.name}</p>
                          <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{s.totalSales} sales</p>
                        </div>
                        <div className="text-sm font-bold" style={{ color: 'var(--terracotta)' }}>★ {s.averageRating?.toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Products */}
          {tab === 'Products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-display text-xl font-semibold mb-6" style={{ color: 'var(--charcoal)' }}>
                Pending Approval ({productsData?.products?.length || 0})
              </h2>
              {(productsData?.products || []).length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto mb-3" style={{ color: 'var(--sage)' }} />
                  <p className="font-semibold" style={{ color: 'var(--charcoal)' }}>All products reviewed!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(productsData?.products || []).map((p) => (
                    <div key={p._id} className="glass-card p-5 flex gap-4 items-center">
                      <img src={p.images?.[0]?.url || 'https://placehold.co/64x64/F2EBE0/C1693A?text=P'}
                        alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--charcoal)' }}>{p.title}</p>
                        <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>By {p.seller?.name} · {p.category}</p>
                        <p className="text-xs font-semibold mt-1" style={{ color: 'var(--terracotta)' }}>{formatPrice(p.price)}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(122,158,126,0.15)', color: 'var(--forest)' }}
                          onClick={() => approveProduct.mutate({ id: p._id, status: 'approved' })}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <CheckCircle size={18} />
                        </motion.button>
                        <motion.button className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                          onClick={() => approveProduct.mutate({ id: p._id, status: 'rejected' })}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <XCircle size={18} />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Users */}
          {tab === 'Users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-display text-xl font-semibold mb-6" style={{ color: 'var(--charcoal)' }}>All Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--sand)' }}>
                      {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--warm-gray)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(usersData?.users || []).map((u) => (
                      <tr key={u._id} className="border-b hover:bg-parchment transition-colors" style={{ borderColor: 'var(--sand)' }}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar?.url || `https://placehold.co/32x32/F2EBE0/C1693A?text=${u.name[0]}`}
                              alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <span className="font-medium" style={{ color: 'var(--charcoal)' }}>{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4" style={{ color: 'var(--warm-gray)' }}>{u.email}</td>
                        <td className="py-3 px-4"><span className="badge badge-terra capitalize">{u.role}</span></td>
                        <td className="py-3 px-4" style={{ color: 'var(--warm-gray)' }}>{formatDate(u.createdAt)}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${u.isActive ? 'badge-sage' : 'badge-dark'}`}>
                            {u.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: u.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(122,158,126,0.15)', color: u.isActive ? '#EF4444' : 'var(--forest)' }}
                            onClick={() => updateUser.mutate({ id: u._id, data: { isActive: !u.isActive } })}
                          >
                            {u.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {tab === 'Orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-display text-xl font-semibold mb-6" style={{ color: 'var(--charcoal)' }}>All Orders</h2>
              <div className="space-y-4">
                {(ordersData?.orders || []).map((o) => {
                  const meta = orderStatusMeta[o.orderStatus] || {};
                  return (
                    <div key={o._id} className="glass-card p-5 flex flex-wrap gap-4 items-center">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs mb-1" style={{ color: 'var(--warm-gray)' }}>#{o._id.slice(-8).toUpperCase()}</p>
                        <p className="font-semibold text-sm" style={{ color: 'var(--charcoal)' }}>{o.buyer?.name}</p>
                        <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{formatDate(o.createdAt)} · {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</p>
                      </div>
                      <span className="badge" style={{ background: `${meta.color}20`, color: meta.color }}>
                        {meta.icon} {meta.label}
                      </span>
                      <p className="font-bold" style={{ color: 'var(--terracotta)' }}>{formatPrice(o.totalAmount)}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
