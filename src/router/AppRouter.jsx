import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Features = lazy(() => import('../pages/Features'));
const CommunityHub = lazy(() => import('../pages/CommunityHub'));
const CommunityChat = lazy(() => import('../pages/CommunityChat'));
const CommunityPreview = lazy(() => import('../pages/CommunityPreview'));
const Rewards = lazy(() => import('../pages/Rewards'));
const Challenges = lazy(() => import('../pages/Challenges'));
const Leaderboard = lazy(() => import('../pages/Leaderboard'));
// const Careers = lazy(() => import('../pages/Careers'));
const Blog = lazy(() => import('../pages/Blog'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const Cookies = lazy(() => import('../pages/Cookies'));
const GarbageMap = lazy(() => import('../pages/GarbageMap'));
const Report = lazy(() => import('../pages/Report'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Profile = lazy(() => import('../pages/Profile'));
const EditProfile = lazy(() => import('../pages/EditProfile'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const HowItWorks = lazy(() => import('../pages/HowItWorks'));
const Wallet = lazy(() => import('../pages/Wallet'));
const UploadProof = lazy(() => import('../pages/UploadProof'));
const ProofResult = lazy(() => import('../pages/ProofResult'));
const MyProofs = lazy(() => import('../pages/MyProofs'));
const Awareness = lazy(() => import('../pages/Awareness'));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function Page({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function AppRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/features" element={<Page><Features /></Page>} />
          <Route path="/community" element={<Page><CommunityHub /></Page>} />
          <Route path="/community/:id" element={<Page><CommunityChat /></Page>} />
          <Route path="/community-preview" element={<Page><CommunityPreview /></Page>} />
          <Route path="/rewards" element={<Page><Rewards /></Page>} />
          <Route path="/challenges" element={<Page><Challenges /></Page>} />
          <Route path="/leaderboard" element={<Page><Leaderboard /></Page>} />
          {/* <Route path="/careers" element={<Page><Careers /></Page>} /> */}
          <Route path="/blog" element={<Page><Blog /></Page>} />
          <Route path="/privacy" element={<Page><Privacy /></Page>} />
          <Route path="/terms" element={<Page><Terms /></Page>} />
          <Route path="/cookies" element={<Page><Cookies /></Page>} />
          <Route path="/report" element={<Page><Report /></Page>} />
          <Route
            path="/proof-upload"
            element={
              <Page>
                <UploadProof />
              </Page>
            }
          />
          <Route
            path="/proof-result"
            element={
              <Page>
                <ProofResult />
              </Page>
            }
          />
          <Route
            path="/my-proofs"
            element={
              <Page>
                <MyProofs />
              </Page>
            }
          />
          <Route path="/garbage-map" element={<Page><GarbageMap /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/signup" element={<Page><Signup /></Page>} />
          <Route path="/profile" element={<Page><Profile /></Page>} />
          <Route path="/profile/edit" element={<Page><EditProfile /></Page>} />
          <Route path="/wallet" element={<Page><Wallet /></Page>} />
          <Route path="/forgot-password" element={<Page><ForgotPassword /></Page>} />
          <Route path="/awareness" element={<Page><Awareness /></Page>} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}