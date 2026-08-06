import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  FiTwitter,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend
} from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeading from '../components/ui/SectionHeading';
import MagneticButton from '../components/ui/MagneticButton';
import './Contact.css';

export default function Contact() {
  const scope = useRef(null);
  useScrollReveal(scope);

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = 'Name is required';
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      e.email = 'Valid email required';
    }

    if (form.message.trim().length < 10) {
      e.message = 'Message must be at least 10 characters';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSending(true);
    setSendError(false);
    setSent(false);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      setSent(true);

      setForm({
        name: '',
        email: '',
        message: '',
      });

      setErrors({});
    } catch (err) {
      console.error('EmailJS Error:', err);
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) =>
      setForm({
        ...form,
        [name]: e.target.value,
      }),
    className: `cf__input ${
      form[name] ? 'cf__input--filled' : ''
    } ${errors[name] ? 'cf__input--error' : ''}`,
  });

  return (
    <div ref={scope} className="contact-page">
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Contact"
            title="Let's build better"
            highlight="cities together"
            subtitle="Questions, partnerships, or want CivicPlay in your city? Reach out."
          />

          <div className="contact__grid">
            <div className="contact__info" data-reveal="left">
              <div className="contact__item">
                <FiMapPin />
                <div>
                  <strong>Address</strong>
                  <span>Ahmedabad, Gujarat, India</span>
                </div>
              </div>

              <div className="contact__item">
                <FiMail />
                <div>
                  <strong>Email</strong>
                  <span>eco.civicplay@gmail.com</span>
                </div>
              </div>

              <div className="contact__socials">
                {[FiTwitter, FiInstagram, FiSend].map((Icon, index) => (
                  <a href="#" key={index} className="contact__social">
                    <Icon />
                  </a>
                ))}
              </div>

              {/* <div className="contact__map">
                <iframe
                  title="map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=72.45%2C23.00%2C72.75%2C23.15&layer=mapnik"
                  loading="lazy"
                />
              </div> */}
            </div>

            <form
              className="contact__form glass"
              onSubmit={submit}
              data-reveal="right"
            >
              <div className="cf__group">
                <input
                  id="name"
                  placeholder=" "
                  {...field('name')}
                />
                <label htmlFor="name">Your Name</label>
                {errors.name && <small>{errors.name}</small>}
              </div>

              <div className="cf__group">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  {...field('email')}
                />
                <label htmlFor="email">Email Address</label>
                {errors.email && <small>{errors.email}</small>}
              </div>

              <div className="cf__group">
                <textarea
                  id="message"
                  rows="5"
                  placeholder=" "
                  {...field('message')}
                />
                <label htmlFor="message">Your Message</label>
                {errors.message && <small>{errors.message}</small>}
              </div>

              <MagneticButton
                variant="primary"
                type="submit"
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </MagneticButton>

              {sent && (
                <p className="cf__success">
                  ✅ Thanks! Your message has been sent successfully.
                </p>
              )}

              {sendError && (
                <p className="cf__error">
                  ❌ Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}