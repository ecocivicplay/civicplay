import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiTarget, FiGift, FiAward, FiCamera } from 'react-icons/fi';
import { useHideOnFooter } from '../../hooks/useHideOnFooter';
import './BottomNav.css';
import ProofActionModal from '../proof/ProofActionModal';
const links = [
  { name: 'Home', to: '/', icon: FiHome },
  { name: 'Challenges', to: '/challenges', icon: FiTarget },
];

const linksRight = [
  { name: 'Rewards', to: '/rewards', icon: FiGift },
  { name: 'Leaderboard', to: '/leaderboard', icon: FiAward },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const hidden = useHideOnFooter();
  const [showProofModal, setShowProofModal] = useState(false);

  return (
    <>
      <nav className={`bnav ${hidden ? 'bnav--hidden' : ''}`} aria-label="Mobile bottom navigation">
        {links.map((l) => (
          <NavLink
            key={l.name}
            to={l.to}
            className={({ isActive }) => `bnav__item ${isActive ? 'bnav__item--active' : ''}`}
          >
            <l.icon className="bnav__icon" />
            <span>{l.name}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className="bnav__camera"
          aria-label="Report an issue with photo or video"
          onClick={() => setShowProofModal(true)}
        >
          <FiCamera />
        </button>

        {linksRight.map((l) => (
          <NavLink
            key={l.name}
            to={l.to}
            className={({ isActive }) => `bnav__item ${isActive ? 'bnav__item--active' : ''}`}
          >
            <l.icon className="bnav__icon" />
            <span>{l.name}</span>
          </NavLink>
        ))}

        <ProofActionModal
          open={showProofModal}
          onClose={() => setShowProofModal(false)}
          onSpotIssue={() => {
            setShowProofModal(false);
            navigate('/report');
          }}
          onUploadProof={() => {
            setShowProofModal(false);
            navigate('/proof-upload', { state: { challenge: null } });
          }}
        />
      </nav>

      <ProofActionModal
        open={showProofModal}
        onClose={() => setShowProofModal(false)}
        onSpotIssue={() => {
          setShowProofModal(false);
          navigate('/report');
        }}
        onUploadProof={() => {
          setShowProofModal(false);
          navigate('/proof-upload', { state: { challenge: null } });
        }}
      />

    </>
  );
}