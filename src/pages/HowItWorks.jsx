import React, { useState, useEffect, useRef } from "react";
import {
  FiUserPlus,
  FiUser,
  FiUsers,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiPlay,
  FiGift,
  FiTrash2,
  FiStar,
  FiActivity,
  FiTarget,
  FiChevronDown,
  FiArrowRight,
} from "react-icons/fi";
import "./HowItWorks.css";
import tutorialVideo from "../assets/video/civicplay-tutorial.mp4";

/* -------------------------------------------------
   Small helper: reveal-on-scroll wrapper
-------------------------------------------------- */
const Reveal = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`hiw-reveal ${visible ? "hiw-reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------
   Data
-------------------------------------------------- */
const STEPS = [
  {
    icon: <FiUserPlus />,
    step: "Step 1",
    title: "Create Your Account",
    desc: "Sign up using your email or Google account.",
  },
  {
    icon: <FiUser />,
    step: "Step 2",
    title: "Complete Your Profile",
    desc: "Add your personal information to unlock all CivicPlay features.",
  },
  {
    icon: <FiUsers />,
    step: "Step 3",
    title: "Join Civic Challenges",
    desc: "Browse available community challenges and join the ones you like.",
  },
  {
    icon: <FiTarget />,
    step: "Step 4",
    title: "Complete Real-world Tasks",
    desc: "Plant trees, clean public places, reduce plastic usage, and help your community.",
  },
  {
    icon: <FiAward />,
    step: "Step 5",
    title: "Earn Points & Rewards",
    desc: "Complete challenges to earn Civic Points, badges, and rewards.",
  },
  {
    icon: <FiTrendingUp />,
    step: "Step 6",
    title: "Climb the Leaderboard",
    desc: "Increase your rank and compete with other community members.",
  },
];

const FEATURES = [
  {
    icon: <FiUsers />,
    title: "Community Challenges",
    desc: "Join meaningful challenges designed to improve your neighborhood.",
    grad: "grad-blue",
  },
  {
    icon: <FiGift />,
    title: "Reward System",
    desc: "Earn Civic Points and redeem them for exciting real rewards.",
    grad: "grad-green",
  },
  {
    icon: <FiTrendingUp />,
    title: "Leaderboard",
    desc: "Compete with citizens and rise to the top of your community.",
    grad: "grad-purple",
  },
  {
    icon: <FiTrash2 />,
    title: "Garbage Reporting",
    desc: "Report waste and unclean spots to help keep areas spotless.",
    grad: "grad-orange",
  },
  {
    icon: <FiStar />,
    title: "Achievements",
    desc: "Unlock badges and milestones as you contribute more.",
    grad: "grad-pink",
  },
  {
    icon: <FiActivity />,
    title: "Profile Progress",
    desc: "Track your impact and growth with a personalized dashboard.",
    grad: "grad-teal",
  },
];

const POINTS_FLOW = [
  { icon: <FiUsers />, label: "Join Challenge" },
  { icon: <FiCheckCircle />, label: "Complete Challenge" },
  { icon: <FiStar />, label: "Earn Points" },
  { icon: <FiAward />, label: "Unlock Badges" },
  { icon: <FiGift />, label: "Redeem Rewards" },
  { icon: <FiTrendingUp />, label: "Move Up Leaderboard" },
];

const FAQS = [
  {
    q: "How do I earn points?",
    a: "You earn Civic Points by joining and completing community challenges. Each completed task awards a set amount of points based on its difficulty and impact.",
  },
  {
    q: "How are rewards calculated?",
    a: "Rewards are calculated from your total Civic Points. As you accumulate points, you unlock badges, tiers, and redeemable rewards automatically.",
  },
  {
    q: "Can I join multiple challenges?",
    a: "Absolutely! You can join as many challenges as you like at the same time and complete them at your own pace.",
  },
  {
    q: "How does the leaderboard work?",
    a: "The leaderboard ranks community members based on their total Civic Points. The more challenges you complete, the higher you climb.",
  },
  {
    q: "Can I edit my profile later?",
    a: "Yes. You can update your personal information, preferences, and profile details anytime from your account settings.",
  },
  {
    q: "How do I report garbage?",
    a: "Use the Garbage Reporting feature to submit a photo and location of any waste or unclean area. Your report helps keep the community clean.",
  },
];

/* -------------------------------------------------
   Video Placeholder Component
   Replace the inner content with a YouTube <iframe>
   or a <video> tag later — the wrapper keeps 16:9.
-------------------------------------------------- */
const VideoPlaceholder = ({ label }) => (
  <div className="hiw-video-frame">
    <video
      className="hiw-video-player"
      controls
      playsInline
      preload="metadata"
    >
      <source src={tutorialVideo} type="video/mp4" />
      Your browser does not support video playback.
    </video>

    {label && (
      <span className="hiw-video-label">
        {label}
      </span>
    )}
  </div>
);

/* -------------------------------------------------
   Main Component
-------------------------------------------------- */
const HowItWorks = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="hiw-page">
      {/* Background decorations */}
      <div className="hiw-bg-orb hiw-bg-orb--1" />
      <div className="hiw-bg-orb hiw-bg-orb--2" />

      {/* ============ SECTION 1 — HERO ============ */}
      <section className="hiw-hero">
        <div className="hiw-container hiw-hero__grid">
          <Reveal className="hiw-hero__content">
            <span className="hiw-badge">
              <FiActivity /> Getting Started
            </span>
            <h1 className="hiw-hero__title">
              How <span className="hiw-gradient-text">CivicPlay</span> Works
            </h1>
            <p className="hiw-hero__subtitle">
              Learn how CivicPlay helps you improve your community, complete
              challenges, earn rewards, and make a real-world impact.
            </p>
            <div className="hiw-hero__actions">
              <button className="hiw-btn hiw-btn--primary">
                Get Started <FiArrowRight />
              </button>
              <button className="hiw-btn hiw-btn--ghost">
                <FiPlay /> Watch Tutorial
              </button>
            </div>
          </Reveal>

          <Reveal className="hiw-hero__media" delay={150}>
            <VideoPlaceholder label="Tutorial Video" subtext="Video Coming Soon" />
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 2 — STEP BY STEP ============ */}
      <section className="hiw-section">
        <div className="hiw-container">
          <Reveal className="hiw-section__head">
            <span className="hiw-eyebrow">Step by Step</span>
            <h2 className="hiw-section__title">Your Journey in Six Steps</h2>
            <p className="hiw-section__desc">
              From sign up to the top of the leaderboard — here's exactly how it
              all comes together.
            </p>
          </Reveal>

          <div className="hiw-timeline">
            <div className="hiw-timeline__line" />
            {STEPS.map((s, i) => (
              <Reveal
                key={i}
                className={`hiw-timeline__item ${i % 2 === 0 ? "is-left" : "is-right"
                  }`}
                delay={i * 60}
              >
                <div className="hiw-step-card">
                  <div className="hiw-step-card__icon hiw-float">{s.icon}</div>
                  <div className="hiw-step-card__body">
                    <span className="hiw-step-card__step">{s.step}</span>
                    <h3 className="hiw-step-card__title">{s.title}</h3>
                    <p className="hiw-step-card__desc">{s.desc}</p>
                  </div>
                </div>
                <span className="hiw-timeline__dot" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 3 — FEATURE HIGHLIGHTS ============ */}
      <section className="hiw-section hiw-section--alt">
        <div className="hiw-container">
          <Reveal className="hiw-section__head">
            <span className="hiw-eyebrow">Feature Highlights</span>
            <h2 className="hiw-section__title">Everything You Need to Contribute</h2>
            <p className="hiw-section__desc">
              A complete toolkit built to make civic action rewarding and fun.
            </p>
          </Reveal>

          <div className="hiw-feature-grid">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="hiw-feature-card">
                  <div className={`hiw-feature-card__icon ${f.grad}`}>
                    {f.icon}
                  </div>
                  <h3 className="hiw-feature-card__title">{f.title}</h3>
                  <p className="hiw-feature-card__desc">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 4 — HOW POINTS WORK ============ */}
      <section className="hiw-section">
        <div className="hiw-container">
          <Reveal className="hiw-section__head">
            <span className="hiw-eyebrow">How Points Work</span>
            <h2 className="hiw-section__title">The Reward Flow</h2>
            <p className="hiw-section__desc">
              Follow the path from joining a challenge to climbing the ranks.
            </p>
          </Reveal>

          <div className="hiw-flow">
            {POINTS_FLOW.map((p, i) => (
              <React.Fragment key={i}>
                <Reveal delay={i * 80}>
                  <div className="hiw-flow-card">
                    <div className="hiw-flow-card__icon">{p.icon}</div>
                    <span className="hiw-flow-card__label">{p.label}</span>
                  </div>
                </Reveal>
                {i < POINTS_FLOW.length - 1 && (
                  <span className="hiw-flow-arrow" aria-hidden="true">
                    <FiChevronDown />
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 5 — VIDEO SECTION ============ */}
      <section className="hiw-section hiw-section--alt">
        <div className="hiw-container">
          <Reveal className="hiw-video-section">
            <div className="hiw-video-section__text">
              <span className="hiw-eyebrow">Watch & Learn</span>
              <h2 className="hiw-section__title">Official CivicPlay Tutorial</h2>
              <p className="hiw-section__desc">
                This video will guide you through every feature.
              </p>
              <button className="hiw-btn hiw-btn--primary">
                <FiPlay /> Watch Tutorial
              </button>
            </div>
            <div className="hiw-video-section__media">
              <VideoPlaceholder
                label="Official CivicPlay Tutorial"
                subtext="Video Coming Soon"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 6 — FAQ ============ */}
      <section className="hiw-section">
        <div className="hiw-container hiw-container--narrow">
          <Reveal className="hiw-section__head">
            <span className="hiw-eyebrow">FAQ</span>
            <h2 className="hiw-section__title">Frequently Asked Questions</h2>
            <p className="hiw-section__desc">
              Everything you might want to know before you get started.
            </p>
          </Reveal>

          <div className="hiw-faq">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <Reveal key={i} delay={i * 50}>
                  <div className={`hiw-faq-item ${isOpen ? "is-open" : ""}`}>
                    <button
                      className="hiw-faq-item__q"
                      onClick={() => toggleFaq(i)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <FiChevronDown className="hiw-faq-item__chevron" />
                    </button>
                    <div className="hiw-faq-item__a-wrap">
                      <div className="hiw-faq-item__a">{item.a}</div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SECTION 7 — CALL TO ACTION ============ */}
      <section className="hiw-section">
        <div className="hiw-container">
          <Reveal>
            <div className="hiw-cta">
              <div className="hiw-cta__glow" />
              <h2 className="hiw-cta__title">Ready to Make a Difference?</h2>
              <p className="hiw-cta__subtitle">
                Join thousands of citizens working together to build cleaner and
                greener communities.
              </p>
              <div className="hiw-cta__actions">
                <button className="hiw-btn hiw-btn--light">
                  Start Challenges <FiArrowRight />
                </button>
                <button className="hiw-btn hiw-btn--outline">
                  View Leaderboard
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
