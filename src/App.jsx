import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/layout/Loader';
import ScrollProgress from './components/layout/ScrollProgress';
import BackToTop from './components/layout/BackToTop';
import FloatingHelp from './components/layout/FloatingHelp';
import BottomNav from './components/layout/BottomNav';
import AppRouter from './router/AppRouter';
import ScrollToTop from './components/layout/ScrollToTop';
import InstallPrompt from './components/pwa/InstallPrompt';

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  useLenis();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const hideFooterRoutes = ['/login', '/signup'];
  const hideFooter = hideFooterRoutes.includes(location.pathname) || location.pathname.startsWith('/community/');

  // full-screen routes hide ALL surrounding UI so nothing overlaps the camera
  const hideChromeRoutes = [
    '/report',
    '/proof-upload',
    '/proof-result',
  ];
  const hideChrome = hideChromeRoutes.includes(location.pathname);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <InstallPrompt />

      {!hideChrome && <ScrollProgress />}

      <ScrollToTop />

      {!hideChrome && <Navbar />}

      <main className={hideChrome ? "fullscreen-page" : ""}>
        <AppRouter />
      </main>

      {!hideChrome && !hideFooter && <Footer />}
      {!hideChrome && <BackToTop />}
      {!hideChrome && <FloatingHelp />}
      {!hideChrome && <BottomNav />}
    </>
  );
}