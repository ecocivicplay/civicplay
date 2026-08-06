import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import SectionHeading from '../ui/SectionHeading';
import { testimonials } from '../../utils/data';
import './Testimonials.css';

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <SectionHeading eyebrow="Testimonials" title="Loved by" highlight="citizens everywhere" />
      </div>
      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 120, modifier: 2.5, slideShadows: false }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="testi__swiper"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.name} className="testi__slide">
            <div className="testi-card glass">
              <p className="testi-card__quote">“{t.text}”</p>
              <div className="testi-card__author">
                <img src={t.avatar} alt={t.name} />
                <div><strong>{t.name}</strong><span>{t.role}</span></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
