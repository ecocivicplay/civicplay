import { useMagnetic } from '../../hooks/useMagnetic';
import './MagneticButton.css';

export default function MagneticButton({ children, variant = 'primary', className = '', ...props }) {
  const { ref, onMove, onLeave } = useMagnetic();

  const ripple = (e) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    circle.style.width = circle.style.height = `${d}px`;
    const rect = btn.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left - d / 2}px`;
    circle.style.top = `${e.clientY - rect.top - d / 2}px`;
    circle.className = 'ripple';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => { ripple(e); props.onClick?.(e); }}
      className={`mag-btn mag-btn--${variant} ${className}`}
      {...props}
    >
      <span className="mag-btn__label">{children}</span>
    </button>
  );
}
