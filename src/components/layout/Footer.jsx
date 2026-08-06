import { Link } from 'react-router-dom';
import { FiTwitter, FiInstagram, FiSend } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo"><span><img className='footer_logo-img' src="/public/logo.png" alt="" /></span>Civic<span className="footer__logoAccent">Play</span></Link>
          <p>Gamifying civic action to build cleaner, greener, and happier cities — one challenge at a time.</p>
          <div className="footer__socials">
            {[FiTwitter, FiInstagram, FiSend].map((Icon, i) => (
              <a href="https://www.instagram.com/civicplay?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" key={i} className="footer__social" aria-label="social"><Icon /></a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>Product</h4>
          <Link to="/Home">Home</Link><Link to="/challenges">Challenges</Link>
          <Link to="/rewards">Rewards</Link><Link to="/community">Community</Link>
        </div>
        <div className="footer__col">
          <h4>Company</h4>
          <Link to="/about">About</Link><Link to="/contact">Contact</Link>
          <Link to="/blog">Blog</Link>
        </div>

        <div className="footer__news">
          <h4>Join the movement</h4>
          <p>Get civic challenges & reward drops in your inbox.</p>
          <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" required />
            <button type="submit" aria-label="subscribe"><FiSend /></button>
          </form>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} CivicPlay. All rights reserved.</p>
        <div className="footer__legal"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link></div>
      </div>
    </footer>
  );
}
