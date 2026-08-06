import SectionHeading from '../ui/SectionHeading';
import { useCounter } from '../../hooks/useCounter';
import { stats } from '../../utils/data';
import './ImpactCounter.css';

function Stat({ value, suffix, label }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="stat" ref={ref}>
      <strong>{count.toLocaleString()}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function ImpactCounter() {
  return (
    <section className="section impact">
      <div className="impact__gradient" />
      <div className="container">
        <SectionHeading eyebrow="Our Impact" title="Numbers that" highlight="change cities" />
        <div className="impact__grid">
          {stats.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
