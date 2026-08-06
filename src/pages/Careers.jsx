import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';
import MagneticButton from '../components/ui/MagneticButton';
import './Careers.css';

const openings = [
  { title: 'Product Designer', team: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Frontend Engineer (React)', team: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Community Manager', team: 'Community', location: 'Ahmedabad, IN', type: 'Full-time' },
  { title: 'Data Scientist — Impact', team: 'Engineering', location: 'Remote', type: 'Contract' },
  { title: 'Partnerships Lead', team: 'Growth', location: 'Hybrid', type: 'Full-time' },
];

const perks = [
  { icon: '🌴', title: 'Flexible time off', desc: 'Take the rest you need, whenever you need it.' },
  { icon: '🏠', title: 'Remote-first', desc: 'Work from anywhere with async-friendly teammates.' },
  { icon: '📈', title: 'Equity for everyone', desc: 'Every hire shares in the upside they help create.' },
  { icon: '🌱', title: 'Civic impact days', desc: 'Paid time each month to run your own civic challenge.' },
];

export default function Careers() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="careers-page">
      <section className="section careers-hero">
        <div className="container">
          <SectionHeading eyebrow="Careers" title="Help us build" highlight="civic-minded cities" subtitle="We're a small, remote-first team obsessed with making real-world impact addictively fun. Come build it with us." />
          <div className="careers__perks" data-stagger>
            {perks.map((p) => (
              <div className="careers-perk" key={p.title}>
                <span className="careers-perk__icon">{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section careers-roles">
        <div className="container">
          <SectionHeading eyebrow="Open Roles" title="Current" highlight="openings" />
          <div className="careers__list" data-stagger>
            {openings.map((job) => (
              <div className="career-row" key={job.title}>
                <div className="career-row__info">
                  <h3>{job.title}</h3>
                  <span className="career-row__team">{job.team}</span>
                </div>
                <div className="career-row__meta">
                  <span><FiMapPin /> {job.location}</span>
                  <span><FiClock /> {job.type}</span>
                </div>
                <MagneticButton className="career-row__btn">Apply <FiArrowRight /></MagneticButton>
              </div>
            ))}
          </div>
          <p className="careers__note">Don't see a fit? Reach out on the <Link to="/contact">Contact</Link> page — we're always happy to hear from civic-minded builders.</p>
        </div>
      </section>
    </div>
  );
}
