import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { useSocket } from './hooks/useSocket';
import MainLayout from './layouts/MainLayout';
import { ProtectedRoute, SellerRoute, AdminRoute, GuestRoute } from './components/auth/RouteGuards';

// Pages – lazy loaded for code splitting
const HomePage         = lazy(() => import('./pages/HomePage'));
const ShopPage         = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage       = lazy(() => import('./pages/OrdersPage'));
const ProfilePage      = lazy(() => import('./pages/ProfilePage'));
const WishlistPage     = lazy(() => import('./pages/WishlistPage'));
const ArtisansPage     = lazy(() => import('./pages/ArtisansPage'));
const FeedPage         = lazy(() => import('./pages/FeedPage'));
const ChatPage         = lazy(() => import('./pages/ChatPage'));
const SellerDashboard  = lazy(() => import('./pages/SellerDashboard'));
const AdminPage        = lazy(() => import('./pages/AdminPage'));
const AboutPage        = lazy(() => import('./pages/AboutPage'));

// Query client config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      cacheTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Page loader fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: 'var(--grad-terra)' }}>
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--warm-gray)' }}>Loading Craftora…</p>
      </div>
    </div>
  );
}

// Not Found Page
function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8" style={{ background: 'var(--cream)' }}>
      <div className="text-8xl font-display font-bold" style={{ color: 'var(--sand)' }}>404</div>
      <h1 className="font-display text-3xl font-semibold" style={{ color: 'var(--charcoal)' }}>Page not found</h1>
      <p style={{ color: 'var(--warm-gray)' }}>This piece of the gallery doesn't exist.</p>
      <a href="/">
        <button className="btn-primary mt-2">Go Home</button>
      </a>
    </div>
  );
}

// App initializer – runs once on mount
function AppInit() {
  const { isDark, init } = useThemeStore();
  const { token, fetchMe } = useAuthStore();

  // Initialize theme
  useEffect(() => { init(isDark); }, []);

  // Restore session
  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  // Initialize socket
  useSocket();

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInit />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Guest-only routes (redirect logged-in users) */}
            <Route element={<GuestRoute />}>
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Main layout routes */}
            <Route element={<MainLayout />}>
              {/* Public */}
              <Route path="/"                 element={<HomePage />} />
              <Route path="/shop"             element={<ShopPage />} />
              <Route path="/products/:id"     element={<ProductDetailPage />} />
              <Route path="/artisans"         element={<ArtisansPage />} />
              <Route path="/artisans/:id"     element={<ArtisansPage />} />
              <Route path="/feed"             element={<FeedPage />} />
              <Route path="/about"            element={<AboutPage />} />

              {/* Protected (logged-in users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout"     element={<CheckoutPage />} />
                <Route path="/orders"       element={<OrdersPage />} />
                <Route path="/orders/:id"   element={<OrdersPage />} />
                <Route path="/profile"      element={<ProfilePage />} />
                <Route path="/wishlist"     element={<WishlistPage />} />
                <Route path="/chat"         element={<ChatPage />} />
              </Route>

              {/* Seller-only */}
              <Route element={<SellerRoute />}>
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
              </Route>

              {/* Admin-only */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
