import GradientText from './GradientText';
import './SectionHeading.css';

export default function SectionHeading({ eyebrow, title, highlight, subtitle, center = true }) {
  return (
    <div className={`sec-head ${center ? 'sec-head--center' : ''}`} data-reveal="up">
      {eyebrow && <span className="sec-head__eyebrow">{eyebrow}</span>}
      <h2 className="sec-head__title">
        {title} {highlight && <GradientText>{highlight}</GradientText>}
      </h2>
      {subtitle && <p className="sec-head__sub">{subtitle}</p>}
    </div>
  );
}
