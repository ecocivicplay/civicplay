import { motion } from 'framer-motion';
import './Loader.css';

export default function Loader() {
  return (
    <motion.div className="loader" exit={{ opacity: 0, transition: { duration: 0.6 } }}>
      <motion.div
        className="loader__logo"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span><img className='footer_logo-img' src="/public/logo.png" alt="" /></span>
        <span className="loader__text">CivicPlay</span>
      </motion.div>
      <div className="loader__bar"><motion.div className="loader__fill" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.6, ease: 'easeInOut' }} /></div>
    </motion.div>
  );
}
