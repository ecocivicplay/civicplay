import SectionHeading from '../ui/SectionHeading';
import { gallery } from '../../utils/data';
import './Gallery.css';

export default function Gallery() {
  return (
    <section className="section gallery" id="community">
      <div className="container">
        <SectionHeading eyebrow="Community" title="Moments from our" highlight="changemakers" subtitle="Real citizens, real impact — captured across cities." />
        <div className="gallery__masonry" data-stagger>
          {gallery.map((g, i) => (
            <figure className={`gal-item gal-item--${g.h}`} key={i}>
              <img src={g.img} alt={g.title} loading="lazy" />
              <figcaption><span>{g.title}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
