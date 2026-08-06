import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import MagneticButton from '../components/ui/MagneticButton';
import GradientText from '../components/ui/GradientText';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await resetPassword(identifier.trim());
      setSent(true);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side__gradient" />
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
          <h2>Forgot Your<br />Password?</h2>
          <p>No worries — we'll email you a secure link to reset it.</p>
        </motion.div>
      </div>

      <div className="auth-formside">
        <Link to="/login" className="auth-back"><FiArrowLeft /> Back to login</Link>

        <motion.div
          className="auth-card glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {sent ? (
            <>
              <FiCheckCircle style={{ fontSize: 40, color: '#16a34a', marginBottom: 12 }} />
              <h1><GradientText>Check Your Email</GradientText></h1>
              <p className="auth-sub">
                We sent a password reset link to <strong>{identifier}</strong>. Click the link in that email to set a new password.
              </p>
              <Link to="/login">
                <MagneticButton variant="primary" className="auth-submit">Back to Login</MagneticButton>
              </Link>
            </>
          ) : (
            <>
              <h1><GradientText>Reset Password</GradientText></h1>
              <p className="auth-sub">Enter your email or mobile number and we'll send you a reset link</p>

              {error && <p className="auth-error">{error}</p>}

              <form onSubmit={submit} className="auth-form">
                <div className="auth-input">
                  <FiMail />
                  <input
                    type="text"
                    placeholder="Email or Mobile Number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <MagneticButton variant="primary" type="submit" className="auth-submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Reset Link'}
                </MagneticButton>
              </form>

              <p className="auth-switch">
                Remember your password? <Link to="/login">Login</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}