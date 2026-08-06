import SectionHeading from '../ui/SectionHeading';
import { steps } from '../../utils/data';
import './HowItWorks.css';

export default function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <SectionHeading eyebrow="How it works" title="Four simple steps to" highlight="real impact" />
        <div className="how__grid" data-stagger>
          {steps.map((s, i) => (
            <div className="how-step" key={s.n}>
              <div className="how-step__num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <img
                src={s.image}
                alt={s.title}
                className="how-step__image"
              />
              {i < steps.length - 1 && <div className="how-step__line" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
