import { useRef } from 'react';

export default function TiltCard({ children, className = '', max = 12 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-6px)`;
  };
  const onLeave = () => {
    ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform 0.35s var(--ease)', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
