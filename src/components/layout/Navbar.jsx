import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiMoon, FiSun, FiUsers } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import MagneticButton from '../ui/MagneticButton';
import ProfileMenu from './ProfileMenu';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const links = [
  { name: 'Home', to: '/' },
  { name: 'Challenges', to: '/challenges' },
  { name: 'Rewards', to: '/rewards' },
  { name: 'Leaderboard', to: '/leaderboard' },
  { name: 'Garbage Map', to: '/garbage-map' },
  // { name: 'About', to: '/about' },
  { name: 'How It Works', to: '/how-it-works' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return (
    <header className={`nav ${(!isHome || scrolled) ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__logo">
          <span><img className="nav__logo-img" src="/logo.png" alt="CivicPlay Logo" /></span>
          <span>Civic<span className="nav__logoAccent">Play</span></span>
        </Link>

        <nav className="nav__links">
          {links.map((l) => (
            <NavLink
              key={l.name}
              to={l.to}
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--active" : "nav__link"
              }
            >
              {l.name}<span className="nav__underline" />
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__theme nav__theme-toggle" onClick={toggle} aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <Link
            to="/community"
            className={`nav__community ${pathname.startsWith('/community') ? 'nav__theme--active' : ''}`}
            aria-label="Community"
            title="Community"
          >
            <FiUsers />
          </Link>
          {user ? (
            <>
              <div className="nav__notification">
                <NotificationBell />
              </div>
              <ProfileMenu />
            </>
          ) : (
            <Link to="/login">
              <MagneticButton variant="primary" className="nav__signup">Login / Sign Up</MagneticButton>
            </Link>
          )}
          <button className="nav__burger" onClick={() => setOpen(true)} aria-label="Menu"><FiMenu /></button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={mobileMenuRef}
              className="nav__mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
            >
              <button className="nav__close" onClick={() => setOpen(false)}>
                <FiX />
              </button>

              <div className="nav__mobile-top">
                <button
                  className="nav__theme"
                  onClick={toggle}
                  aria-label="Toggle theme"
                >
                  <FiMoon size={20} color="currentColor" />
                </button>

                {user && <NotificationBell />}
              </div>

              {links.map((l, i) => (
                <Link
                  key={l.name}
                  to={l.to}
                  className="nav__mlink"
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    style={{ width: "100%" }}
                  >
                    {l.name}
                  </motion.div>
                </Link>
              ))}

              {!user && (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <MagneticButton variant="primary">
                    Login / Sign Up
                  </MagneticButton>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}