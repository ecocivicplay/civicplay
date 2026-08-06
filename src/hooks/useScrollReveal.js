import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Generic reveal: applies to any element with [data-reveal]
export function useScrollReveal(scope) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const type = el.dataset.reveal;
        const delay = parseFloat(el.dataset.delay || 0);
        const from = {
          up: { y: 60, opacity: 0 },
          left: { x: -80, opacity: 0 },
          right: { x: 80, opacity: 0 },
          scale: { scale: 0.85, opacity: 0 },
          rotate: { rotate: 8, opacity: 0, y: 40 },
        }[type] || { y: 60, opacity: 0 };

        gsap.fromTo(el, from, {
          x: 0, y: 0, scale: 1, rotate: 0, opacity: 1,
          duration: 1, delay, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      gsap.utils.toArray('[data-stagger]').forEach((group) => {
        gsap.fromTo(group.children,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 82%' } }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [scope]);
}
