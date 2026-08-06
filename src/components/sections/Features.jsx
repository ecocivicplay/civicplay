import TiltCard from '../ui/TiltCard';
import SectionHeading from '../ui/SectionHeading';
import { features } from '../../utils/data';
import './Features.css';

export default function Features() {
  return (
    <section className="section features" id="features">
      <div className="blob" style={{ background: 'var(--secondary)', top: '10%', right: '-5%', width: 300, height: 300 }} />
      <div className="container">
        <SectionHeading eyebrow="Features" title="Everything you need to" highlight="power civic change" subtitle="A complete toolkit that makes reporting, acting, and rewarding effortless and fun." />
        <div className="features__grid" data-stagger>
          {features.map((f) => (
            <TiltCard key={f.title} className="feature-card tilt">
              <div className="feature-card__icon"><f.icon /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-card__glow" />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
