import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/layout/CartDrawer';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--parchment)',
            color: 'var(--charcoal)',
            border: '1px solid var(--glass-border)',
            borderRadius: '14px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#7A9E7E', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#C1693A', secondary: '#fff' } },
        }}
      />
    </div>
  );
}
