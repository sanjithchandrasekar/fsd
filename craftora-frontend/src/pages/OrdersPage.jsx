import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate, orderStatusMeta } from '../utils/helpers';

function OrderTimeline({ timeline }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ background: 'var(--sand)' }} />
      {timeline.map((t, i) => {
        const meta = orderStatusMeta[t.status] || { icon: '📦', color: '#6B7280' };
        return (
          <motion.div
            key={i} className="relative mb-4 last:mb-0"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className="absolute -left-6 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs"
              style={{ background: meta.color, top: '2px' }}
            >
              {meta.icon}
            </div>
            <div className="pl-2">
              <p className="font-semibold text-sm capitalize" style={{ color: 'var(--charcoal)' }}>{t.status.replace('_', ' ')}</p>
              <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>{t.message}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--warm-gray)' }}>{formatDate(t.timestamp)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderAPI.getMyOrders().then((r) => r.data),
  });

  const orders = data?.orders || [];

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="section-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="section-eyebrow">Order History</span>
          <h1 className="font-display text-4xl font-bold" style={{ color: 'var(--charcoal)' }}>My Orders</h1>
        </motion.div>

        {isLoading ? (
          <div className="space-y-6">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-6xl mb-4">📦</div>
            <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--charcoal)' }}>No orders yet</h2>
            <p className="mb-6" style={{ color: 'var(--warm-gray)' }}>Discover handcrafted goods and place your first order!</p>
            <Link to="/shop"><button className="btn-primary">Start Shopping</button></Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => {
              const meta = orderStatusMeta[order.orderStatus] || {};
              return (
                <motion.div
                  key={order._id}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="font-mono text-xs mb-1" style={{ color: 'var(--warm-gray)' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>Placed {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{meta.icon}</span>
                      <span className="badge" style={{ background: `${meta.color}20`, color: meta.color }}>
                        {meta.label || order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
                    {order.items?.map((item, j) => (
                      <div key={j} className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                        <img src={item.image || 'https://placehold.co/64x64/F2EBE0/C1693A?text=C'} alt={item.title}
                          className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  {order.trackingTimeline?.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--terracotta)' }}>
                        Tracking Timeline
                      </p>
                      <OrderTimeline timeline={order.trackingTimeline} />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--sand)' }}>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--warm-gray)' }}>
                        {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                      <p className="font-bold text-base" style={{ color: 'var(--terracotta)' }}>
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                    <Link to={`/orders/${order._id}`}>
                      <button className="btn-outline text-sm py-2 px-5">View Details</button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
