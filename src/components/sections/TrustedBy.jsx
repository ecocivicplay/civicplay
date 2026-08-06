import Marquee from '../ui/Marquee';
import { trustedLogos } from '../../utils/data';
import './TrustedBy.css';

export default function TrustedBy() {
  return (
    <section className="trusted">
      <div className="container">
        <p className="trusted__label" data-reveal="up">Trusted by forward-thinking cities & organisations</p>
      </div>
      <Marquee items={trustedLogos} speed={25} />
    </section>
  );
}
