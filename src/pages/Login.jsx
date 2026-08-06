import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import MagneticButton from '../components/ui/MagneticButton';
import GradientText from '../components/ui/GradientText';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.identifier.trim(), form.password);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-side">
        <div className="auth-side__gradient" />
        <div className="auth-side__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 10}s`,
                width: `${3 + Math.random() * 5}px`,
                height: `${3 + Math.random() * 5}px`,
              }}
            />
          ))}
        </div>

        <Link to="/" className="auth-side__logo">
          <span className="auth-side__mark">C</span>
          <span>CivicPlay</span>
        </Link>

        <motion.div
          className="auth-side__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Play for Your City.<br />Change Lives.</h2>
          <p>Report issues, complete challenges, and earn real rewards for making your city better.</p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="auth-formside">
        <Link to="/" className="auth-back"><FiArrowLeft /> Back to home</Link>

        <motion.div
          className="auth-card glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1><GradientText>Welcome Back</GradientText></h1>
          <p className="auth-sub">Login to continue to CivicPlay</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={submit} className="auth-form">
            <div className="auth-input">
              <FiMail />
              <input
                type="text"
                placeholder="Email or Mobile Number"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                required
              />
            </div>

            <div className="auth-input">
              <FiLock />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="auth-row">
              <label className="auth-remember">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
            </div>

            <div className="auth-actions-row">
              <MagneticButton variant="primary" type="submit" className="auth-submit" disabled={submitting}>
                {submitting ? 'Logging in…' : 'Login'}
              </MagneticButton>

              <div className="auth-divider"><span>or</span></div>

              <button className="auth-google" onClick={handleGoogle} type="button">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Google
              </button>
            </div>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}