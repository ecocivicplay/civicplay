import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { faqs } from '../../utils/data';
import './FAQ.css';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="container faq__wrap">
        <SectionHeading eyebrow="FAQ" title="Questions?" highlight="Answered." center={false} />
        <div className="faq__list">
          {faqs.map((f, i) => (
            <div className={`faq-item ${open === i ? 'faq-item--open' : ''}`} key={i} data-reveal="up" data-delay={i * 0.05}>
              <button className="faq-item__q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <FiPlus className="faq-item__icon" />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="faq-item__a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
