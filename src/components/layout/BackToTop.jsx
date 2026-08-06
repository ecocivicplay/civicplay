import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useHideOnFooter } from '../../hooks/useHideOnFooter';
import './BackToTop.css';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const footerVisible = useHideOnFooter();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`back-top ${show && !footerVisible ? 'back-top--show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <FiArrowUp />
    </button>
  );
}