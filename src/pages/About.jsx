import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';
import { timeline } from '../utils/data';
import './About.css';

const values = [
  { icon: '🎯', title: 'Our Mission', desc: 'Make civic participation as engaging and rewarding as your favourite game.' },
  { icon: '🌍', title: 'Our Vision', desc: 'A world where every citizen actively shapes cleaner, kinder cities.' },
  { icon: '💎', title: 'Our Values', desc: 'Transparency, community, sustainability, and joyful impact.' },
];

export default function About() {
  const scope = useRef(null);
  useScrollReveal(scope);
  return (
    <div ref={scope} className="about-page">
      <section className="section about-hero">
        <div className="container">
          <SectionHeading eyebrow="About Us" title="We make cities better," highlight="one play at a time" subtitle="CivicPlay was born from a simple belief: civic action should be joyful, social, and rewarding." />
          <div className="about__values" data-stagger>
            {values.map((v) => (
              <div className="about-value" key={v.title}>
                <span className="about-value__icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-timeline">
        <div className="container">
          <SectionHeading eyebrow="Journey" title="Our story so" highlight="far" />
          <div className="timeline">
            {timeline.map((t, i) => (
              <div className={`tl-item ${i % 2 ? 'tl-item--right' : ''}`} key={t.year} data-reveal={i % 2 ? 'left' : 'right'}>
                <div className="tl-item__dot" />
                <div className="tl-item__card">
                  <span className="tl-item__year">{t.year}</span>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
