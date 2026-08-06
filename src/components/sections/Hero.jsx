import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';
import GradientText from '../ui/GradientText';
import { heroImages, heroCards } from '../../utils/data';
import './Hero.css';

export default function Hero() {
  const [active, setActive] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % heroImages.length), 6000);
    return () => clearInterval(id);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const el = heroRef.current;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty('--px', `${x * 14}px`);
      el.style.setProperty('--py', `${y * 14}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="hero" ref={heroRef} id="home">
      <div className="hero__bg">
        {heroImages.map((img, i) => {
          const shouldLoad = i === active || i === (active + 1) % heroImages.length;
          return (
            <div
              key={i}
              className={`hero__slide ${i === active ? 'hero__slide--active' : ''}`}
              style={{ backgroundImage: shouldLoad ? `url(${img})` : 'none' }}
            />
          );
        })}
        <div className="hero__overlay" />
      </div>

      {/* Particles */}
      <div className="hero__particles">
        {Array.from({ length: 26 }).map((_, i) => (
          <span key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s`, animationDuration: `${8 + Math.random() * 10}s`, width: `${3 + Math.random() * 5}px`, height: `${3 + Math.random() * 5}px` }} />
        ))}
      </div>

      <div className="hero__gradient hero__gradient--1" />
      <div className="hero__gradient hero__gradient--2" />

      <div className="container hero__inner">
        <motion.div className="hero__left" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <motion.span className="hero__badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            🎮 Gamify Your City
          </motion.span>
          <h1 className="hero__title">
            Play for Your City. <br />
            <GradientText>Change Lives.</GradientText> <br />
            Earn Rewards.
          </h1>
          <p className="hero__sub">
            CivicPlay turns everyday civic action into an addictive game. Report issues, join challenges,
            and earn real rewards while building a cleaner, greener city.
          </p>
          {/* <div className="hero__cta">
            <MagneticButton variant="primary">Start Reporting</MagneticButton>
            <MagneticButton variant="ghost">Explore Challenges</MagneticButton>
          </div> */}
          {/* <div className="hero__stats-row">
            <div><strong>98K+</strong><span>Active Citizens</span></div>
            <div><strong>40+</strong><span>Cities</span></div>
            <div><strong>4.9★</strong><span>App Rating</span></div>
          </div> */}
        </motion.div>

        {/* <div className="hero__right">
          {heroCards.map((c, i) => (
            <motion.div
              key={c.label}
              className="hero__card glass"
              initial={{ opacity: 0, y: 60, rotateY: 20 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.8 }}
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <span className="hero__card-icon">{c.icon}</span>
              <div>
                <strong>{c.value}</strong>
                <span>{c.label}</span>
              </div>
            </motion.div>
          ))}
        </div> */}
      </div>

      {/* <div className="hero__scroll"><span /></div> */}
    </section>
  );
}
