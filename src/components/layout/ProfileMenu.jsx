import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiCreditCard, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './ProfileMenu.css';

export default function ProfileMenu() {
  const { user, profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate('/');
  }

  const displayName = profile?.name || user?.displayName || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="profileMenu" ref={ref}>
      <button className="profileMenu__trigger" onClick={() => setOpen((o) => !o)}>
        <span className="profileMenu__avatar">{initial}</span>
        <FiChevronDown className={`profileMenu__chevron ${open ? 'profileMenu__chevron--open' : ''}`} />
      </button>

      {open && (
        <div className="profileMenu__dropdown">
          <div className="profileMenu__header">
            <span className="profileMenu__avatar profileMenu__avatar--lg">{initial}</span>
            <div>
              <p className="profileMenu__name">{displayName}</p>
              <p className="profileMenu__email">{user?.email}</p>
            </div>
          </div>

          <Link to="/profile" className="profileMenu__item" onClick={() => setOpen(false)}>
            <FiUser /> Profile
          </Link>
          <Link to="/wallet" className="profileMenu__item" onClick={() => setOpen(false)}>
            <FiCreditCard /> Wallet
          </Link>
          <button className="profileMenu__item profileMenu__item--danger" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </div>
  );
}