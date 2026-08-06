import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft, FiPhone } from 'react-icons/fi';
import MagneticButton from '../components/ui/MagneticButton';
import GradientText from '../components/ui/GradientText';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import { City } from "country-state-city";
import {
  checkUsername,
  sendEmailOTP,
  verifyEmailOTP,
} from "../services/userService";

const indianCities = City.getCitiesOfCountry("IN");
export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    gender: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    // Check if username is available
    try {
      const result = await checkUsername(form.username);

      if (!result.available) {
        setError(result.message);
        return;
      }
    } catch (err) {
      setError(err.message);
      return;
    }

    setSubmitting(true);

    try {
      // STEP 1: Send Email OTP
      if (!otpSent) {
        await sendEmailOTP(form.email);

        setOtpSent(true);

        alert("Email OTP sent successfully.");

        return;
      }

      // STEP 2: Verify Email OTP
      await verifyEmailOTP(form.email, emailOTP);

      // STEP 4: Create Account
      await signup({
        name: form.name,
        username: form.username,
        email: form.email,
        mobile: form.mobile,
        gender: form.gender,
        city: form.city,
        password: form.password,
      });

      alert("Account created successfully.");
      navigate("/");

      // Firebase signup will be added after both Email & Mobile OTP are verified.

    } catch (err) {
      setError(err.message);
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
          <h2>Join the Movement.<br />Make an Impact.</h2>
          <p>Sign up in seconds and start earning rewards for real civic action in your city.</p>
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
          <h1><GradientText>Create Account</GradientText></h1>
          <p className="auth-sub">Join CivicPlay and start making an impact</p>

          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={submit} className="auth-form">
            <div className="auth-input">
              <FiUser />
              <input type="text" placeholder="Full Name" value={form.name} onChange={update('name')} required />
            </div>

            <div className="auth-input">
              <FiUser />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={update('username')}
                required
              />
            </div>

            <div className="auth-input">
              <FiMail />
              <input type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
            </div>

            <div className="auth-input">
              <FiPhone />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={update('mobile')}
                maxLength={10}
                required
              />
            </div>

            <div className="auth-row auth-row-two">
              <select
                className="auth-select"
                value={form.gender}
                onChange={update('gender')}
                required
              >
                <option value="" disabled>Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>

              <select
                className="auth-select"
                value={form.city}
                onChange={update('city')}
                required
              >
                <option value="" disabled>Select City</option>

                {indianCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-input">
              <FiLock />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={update('password')}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="auth-input">
              <FiLock />
              <input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                {showConfirmPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {otpSent && (
              <div className="auth-input">
                <input
                  type="text"
                  placeholder="Enter Email OTP"
                  value={emailOTP}
                  onChange={(e) => setEmailOTP(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            )}

            <MagneticButton
              variant="primary"
              type="submit"
              className="auth-submit"
              disabled={submitting}
            >
              {
                otpSent ? "Verify OTP & Sign Up" : "Send OTP"
              }
            </MagneticButton>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <button
              className="auth-google"
              onClick={handleGoogle}
              type="button"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              Continue with Google
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}