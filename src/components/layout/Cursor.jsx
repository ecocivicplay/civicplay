import { useEffect, useRef } from 'react';
import './Cursor.css';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) return;
    document.body.classList.add('custom-cursor');
    let rx = 0, ry = 0, mx = 0, my = 0;

    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.current.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const raf = () => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(raf);
    };
    const over = (e) => {
      if (e.target.closest('a, button, .tilt, [data-hover]')) ring.current.classList.add('cursor__ring--active');
      else ring.current.classList.remove('cursor__ring--active');
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    raf();
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); document.body.classList.remove('custom-cursor'); };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor__dot" />
      <div ref={ring} className="cursor__ring" />
    </>
  );
}
