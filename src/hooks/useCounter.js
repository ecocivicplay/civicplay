import { useEffect, useRef, useState } from 'react';

export function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * target));
            if (p < 1) rafId.current = requestAnimationFrame(tick);
            else setCount(target);
          };
          cancelAnimationFrame(rafId.current);
          rafId.current = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId.current);
          setCount(0);
        }
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return { count, ref };
}