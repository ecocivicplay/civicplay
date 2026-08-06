import { useRef } from 'react';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';
import TiltCard from '../components/ui/TiltCard';
import './Blog.css';

const posts = [
  { title: '5 Ways Gamification Is Cleaning Up Our Streets', date: 'Jul 12, 2026', tag: 'Impact', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', excerpt: 'How playful design is turning everyday citizens into consistent civic contributors.' },
  { title: 'Inside the AI That Verifies Every Report', date: 'Jul 3, 2026', tag: 'Product', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', excerpt: 'A look at the image recognition pipeline behind CivicPlay verified reports.' },
  { title: 'Meet the Top 10 Changemakers of June', date: 'Jun 28, 2026', tag: 'Community', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', excerpt: 'Celebrating the citizens who topped the leaderboard and their neighbourhoods.' },
  { title: 'How Three Cities Cut Waste Complaints by 40%', date: 'Jun 15, 2026', tag: 'Case Study', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80', excerpt: 'A breakdown of the challenge campaigns that drove measurable civic outcomes.' },
  { title: 'Designing Rewards People Actually Want', date: 'Jun 2, 2026', tag: 'Product', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', excerpt: 'Why gift cards beat badges, and other lessons from our rewards data.' },
  { title: 'The Psychology Behind Civic Habit Loops', date: 'May 20, 2026', tag: 'Research', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', excerpt: 'Applying behavioural science to keep civic participation consistent, not sporadic.' },
];

export default function Blog() {
  const scope = useRef(null);
  useScrollReveal(scope);

  return (
    <div ref={scope} className="blog-page">
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Blog" title="Stories from the" highlight="civic frontier" subtitle="Product updates, research, and stories from the community driving real change." />
          <div className="blog__grid" data-stagger>
            {posts.map((p) => (
              <TiltCard key={p.title} className="blog-card tilt">
                <div className="blog-card__img" style={{ backgroundImage: `url(${p.img})` }}>
                  <span className="blog-card__tag">{p.tag}</span>
                </div>
                <div className="blog-card__body">
                  <span className="blog-card__date"><FiCalendar /> {p.date}</span>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="blog-card__link">Read more <FiArrowRight /></span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
