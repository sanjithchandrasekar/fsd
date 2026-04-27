import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Require authentication
export function ProtectedRoute() {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Require seller or admin role
export function SellerRoute() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'seller' && user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

// Require admin role
export function AdminRoute() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

// Redirect to home if already logged in
export function GuestRoute() {
  const { user } = useAuthStore();
  return !user ? <Outlet /> : <Navigate to="/" replace />;
}
