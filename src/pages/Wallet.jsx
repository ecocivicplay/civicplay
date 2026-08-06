// Wallet.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
    Wallet as WalletIcon,
    Sparkles,
    TrendingUp,
    Gift,
    CheckCircle2,
    Nfc,
    QrCode,
    BadgeCheck,
    ArrowUpRight,
    ArrowDownLeft,
    ShieldCheck,
} from "lucide-react";
import "./Wallet.css";

import { useAuth } from "../context/AuthContext";

/* ---------- helpers ---------- */

// Read a value from an object trying multiple possible key names.
const pick = (obj, keys, fallback = undefined) => {
    if (!obj) return fallback;
    for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return fallback;
};

const formatNumber = (n) => {
    const num = Number(n);
    if (Number.isNaN(num)) return "—";
    return num.toLocaleString("en-US");
};

const formatDate = (value) => {
    if (!value) return "—";

    let d;
    if (typeof value === "object") {
        // Firestore Timestamp: either a real Timestamp instance (has toDate())
        // or a plain serialized shape like { seconds, nanoseconds }.
        if (typeof value.toDate === "function") {
            d = value.toDate();
        } else if (typeof value.seconds === "number") {
            d = new Date(value.seconds * 1000);
        } else {
            d = new Date(value);
        }
    } else {
        d = new Date(value);
    }

    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Convert a Firestore-ish timestamp / date value into a real JS Date, or null.
const toDate = (value) => {
    if (!value) return null;
    let d;
    if (typeof value === "object") {
        if (typeof value.toDate === "function") {
            d = value.toDate();
        } else if (typeof value.seconds === "number") {
            d = new Date(value.seconds * 1000);
        } else {
            d = new Date(value);
        }
    } else {
        d = new Date(value);
    }
    return Number.isNaN(d.getTime()) ? null : d;
};

// Card expiry: 5 years after the account's creation date. MM/YY, like a real card.
const formatExpiry = (memberSince) => {
    const created = toDate(memberSince);
    if (!created) return "—/—";
    const exp = new Date(created);
    exp.setFullYear(exp.getFullYear() + 5);
    const mm = String(exp.getMonth() + 1).padStart(2, "0");
    const yy = String(exp.getFullYear()).slice(-2);
    return `${mm}/${yy}`;
};

// Deterministic 3-digit CVV derived from the user's own civicId — same input
// always yields the same output, so it's stable across renders/sessions
// without needing a separate stored secret field.
const deriveCvv = (civicId) => {
    const src = String(civicId ?? "");
    if (!src) return "—";
    let hash = 0;
    for (let i = 0; i < src.length; i++) {
        hash = (hash * 31 + src.charCodeAt(i)) >>> 0;
    }
    const cvv = 100 + (hash % 900); // always 3 digits, 100–999
    return String(cvv);
};

/* ---------- animated counter ---------- */
function AnimatedNumber({ value, duration = 1.1, suffix = "" }) {
    const [display, setDisplay] = useState(0);
    const target = Number(value);

    useEffect(() => {
        if (Number.isNaN(target)) return;
        let raf;
        const start = performance.now();
        const from = 0;
        const tick = (now) => {
            const t = Math.min((now - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            setDisplay(Math.round(from + (target - from) * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);

    if (Number.isNaN(target)) return <span>—</span>;
    return (
        <span>
            {display.toLocaleString("en-US")}
            {suffix}
        </span>
    );
}

/* ---------- data hook ---------- */
function useWalletData() {
    const auth = useAuth();

    const ctxUser = useMemo(() => ({
        ...(auth?.user || {}),
        ...(auth?.profile || {}),
    }), [auth?.user, auth?.profile]);

    const [profile, setProfile] = useState(ctxUser);
    const [transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                if (mounted) {
                    setProfile(ctxUser);

                    const embedded = pick(ctxUser, [
                        "transactions",
                        "history"
                    ]);

                    setTransactions(
                        Array.isArray(embedded)
                            ? embedded
                            : []
                    );
                }
            } catch (err) {
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctxUser]);

    return { profile, transactions, loading, error };
}

/* ---------- normalize profile into display fields ---------- */
function normalizeProfile(profile) {
    if (!profile) return null;
    return {
        name:
            pick(profile, ["name", "fullName", "displayName", "username"]) ??
            "Civic Member",
        username: pick(profile, ["username", "handle"]) ?? null,
        civicId:
            pick(profile, ["civicId", "civic_id", "uniqueNumber", "id", "_id", "uid"]) ??
            null,
        points: pick(profile, ["civicPoints", "points", "balance", "availablePoints"]),
        totalEarned: pick(profile, ["totalEarned", "totalPoints", "lifetimePoints"]),
        redeemed: pick(profile, ["redeemedRewards", "redeemedPoints", "spent"]),
        challenges: pick(profile, [
            "completedChallenges",
            "challengesCompleted",
            "challenges",
        ]),
        rank: pick(profile, ["rank", "civicRank", "tier", "level"]),
        impactScore: pick(profile, [
            "impactScore",
            "environmentalImpactScore",
            "impact",
        ]),
        memberSince: pick(profile, [
            "memberSince",
            "createdAt",
            "created_at",
            "joinedAt",
            "joined",
        ]),
    };
}

/* ---------- 3D CivicCard ---------- */
function CivicCard({ data }) {
    const [flipped, setFlipped] = useState(false);
    const ref = useRef(null);

    // Free-spin rotation driven by pointer/touch drag on both axes — this is
    // what makes the card behave like an actual 3D object you can turn.
    const rotY = useMotionValue(0);
    const rotX = useMotionValue(0);

    const dragInfo = useRef(null);

    const handlePointerDown = (e) => {
        const el = ref.current;
        if (el?.setPointerCapture) {
            try {
                el.setPointerCapture(e.pointerId);
            } catch {
                /* older browsers without pointer capture — safe to ignore */
            }
        }
        dragInfo.current = {
            x: e.clientX,
            y: e.clientY,
            rotY: rotY.get(),
            rotX: rotX.get(),
        };
    };

    const handlePointerMove = (e) => {
        if (!dragInfo.current) return;
        const dx = e.clientX - dragInfo.current.x;
        const dy = e.clientY - dragInfo.current.y;

        // No clamping on either axis — full free rotation, like spinning a
        // physical card between your fingers.
        rotY.set(dragInfo.current.rotY + dx * 0.6);
        rotX.set(dragInfo.current.rotX - dy * 0.6);
    };

    // Nearest angle that is visually equivalent to "front facing" (0°, 360°,
    // -360°, …), taking the shortest path back from wherever the drag left it.
    const nearestFront = (angle) => {
        const norm = ((angle % 360) + 360) % 360;
        return norm <= 180 ? angle - norm : angle + (360 - norm);
    };

    const endDrag = () => {
        if (!dragInfo.current) return;

        // Letting go always settles the card back to the front, from whatever
        // angle it was released at.
        animate(rotY, nearestFront(rotY.get()), {
            type: "spring",
            stiffness: 80,
            damping: 14,
        });
        animate(rotX, nearestFront(rotX.get()), {
            type: "spring",
            stiffness: 90,
            damping: 15,
        });
        setFlipped(false);
        dragInfo.current = null;
    };

    // Ambient shadow: narrows as the card turns edge-on on either axis, like a
    // real cast shadow would.
    const shadowScaleX = useTransform([rotY, rotX], ([ry, rx]) => {
        const radY = (ry * Math.PI) / 180;
        const radX = (rx * Math.PI) / 180;
        return 0.55 + Math.abs(Math.cos(radY) * Math.cos(radX)) * 0.45;
    });

    const displayId = data?.civicId
        ? String(data.civicId).length > 12
            ? `CP-${String(data.civicId).slice(-8).replace(/(.{4})(.{4})/, "$1-$2")}`
            : data.civicId
        : "CP-—";

    const watermarkText = Array.from({ length: 14 }).fill("CIVICPLAY").join("   ");

    return (
        <div className="cw-card-zone">
            <div
                className="cw-card-scene"
                ref={ref}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={(e) => {
                    // Only end the interaction if no button/finger is actually down.
                    if (e.buttons === 0 && e.pointerType !== "touch") endDrag();
                }}
            >
                <motion.div
                    className="cw-card-ambient-shadow"
                    style={{ scaleX: shadowScaleX }}
                    aria-hidden
                />
                <motion.div
                    className="cw-card"
                    style={{ rotateX: rotX, rotateY: rotY }}
                    whileHover={{ scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                    {/* FRONT */}
                    <div className="cw-face cw-face-front">
                        <div className="cw-watermark cw-watermark-top" aria-hidden>
                            {watermarkText}
                        </div>
                        <div className="cw-watermark cw-watermark-bottom" aria-hidden>
                            {watermarkText}
                        </div>

                        <CivicSkyline />
                        <div className="cw-holo" />
                        <div className="cw-sheen" />
                        <div className="cw-grain" aria-hidden />

                        <div className="cw-row cw-top-row">
                            <div className="cw-logo">CivicPlay</div>
                            <span className="cw-card-tag">Virtual</span>
                        </div>

                        <div className="cw-row cw-chip-row">
                            <div className="cw-chip" aria-hidden>
                                <span className="cw-chip-grid" />
                            </div>
                            <Nfc size={24} className="cw-nfc" />
                        </div>

                        <div className="cw-row cw-card-bottom">
                            <div className="cw-card-details">
                                <div className="cw-mini-label cw-field-label">Cardholder</div>
                                <div className="cw-card-name">{data?.name ?? "—"}</div>
                                <div className="cw-card-number">{displayId}</div>
                            </div>
                            <div className="cw-cp-mark">
                                <span className="cw-cp-circles" aria-hidden>
                                    <span className="cw-cp-circle cw-cp-circle-a" />
                                    <span className="cw-cp-circle cw-cp-circle-b" />
                                </span>
                                <span className="cw-cp-label">Powered by CP</span>
                            </div>
                        </div>
                    </div>

                    {/* BACK */}
                    <div className="cw-face cw-face-back">
                        <div className="cw-watermark cw-watermark-top" aria-hidden>
                            {watermarkText}
                        </div>
                        <div className="cw-watermark cw-watermark-bottom" aria-hidden>
                            {watermarkText}
                        </div>

                        <CivicSkyline dim />
                        <div className="cw-holo" />
                        <div className="cw-grain" aria-hidden />
                        <div className="cw-magstripe" />

                        <div className="cw-row cw-top-row">
                            <div className="cw-logo">CivicPlay</div>
                            <span className="cw-verified">
                                <ShieldCheck size={13} /> Verified Civic Member
                            </span>
                        </div>

                        <div className="cw-back-cvv-row">
                            <div className="cw-back-signature" aria-hidden>
                                <span className="cw-back-signature-italic">Authorized signature</span>
                            </div>
                            <div className="cw-cvv-box">
                                <span className="cw-mini-label">CVV</span>
                                <span className="cw-cvv-value">{deriveCvv(data?.civicId)}</span>
                            </div>
                        </div>

                        <div className="cw-back-expiry-row">
                            <span className="cw-mini-label">Valid Thru</span>
                            <span className="cw-back-value">{formatExpiry(data?.memberSince)}</span>
                        </div>

                        <div className="cw-terms-divider" />
                        <p className="cw-terms">
                            This card remains property of CivicPlay and is non-transferable.
                            CivicPoints have no cash value and are subject to the CivicPlay
                            Rewards Terms. Report loss or misuse immediately in the app. By
                            using this card you agree to CivicPlay's Terms of Service and
                            Privacy Policy.
                        </p>

                        <div className="cw-row cw-back-footer">
                            <span className="cw-back-note">
                                Scan to verify this CivicCard identity.
                            </span>
                            <div className="cw-qr">
                                <QrCode size={40} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <button
                className="cw-flip-btn"
                onClick={() => {
                    animate(rotY, rotY.get() + 180, {
                        type: "spring",
                        stiffness: 90,
                        damping: 15,
                    });
                    setFlipped((f) => !f);
                }}
            >
                <BadgeCheck size={15} />
                {flipped ? "Show Front" : "Flip Card"}
            </button>
            <span className="cw-hint">Drag or swipe to spin it 360° · it settles back to front when you let go</span>
        </div>
    );
}

/* ---------- decorative skyline (used on both card faces) ---------- */
function CivicSkyline({ dim = false }) {
    return (
        <svg
            className={`cw-skyline${dim ? " cw-skyline-dim" : ""}`}
            viewBox="0 0 420 160"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="cwSkylineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#18ce96" />
                    <stop offset="55%" stopColor="#2f9ee0" />
                    <stop offset="100%" stopColor="#2f6fed" />
                </linearGradient>
            </defs>
            <g fill="none" stroke="url(#cwSkylineGradient)" strokeWidth="1.6">
                <polyline points="0,140 40,140 40,90 80,90 80,120 110,120 110,60 140,60 140,140" />
                <polyline points="140,140 170,140 170,40 175,40 175,25 180,25 180,40 185,40 185,140" />
                <rect x="200" y="20" width="46" height="120" />
                <line x1="223" y1="20" x2="223" y2="0" />
                <polyline points="246,140 246,70 260,70 260,95 275,95 275,70 290,70 290,140" />
                <polyline points="290,140 310,140 310,100 330,100 330,140" />
                <polyline points="330,140 340,140 340,80 360,80 360,60 380,60 380,140" />
                <polyline points="380,140 420,140 420,110" />
            </g>
        </svg>
    );
}

/* ---------- skeleton ---------- */
function Skeleton() {
    return (
        <div className="cw-root">
            <div className="cw-container">
                <div className="cw-sk cw-sk-badge" />
                <div className="cw-sk cw-sk-title" />
                <div className="cw-sk cw-sk-sub" />
                <div className="cw-grid">
                    <div className="cw-main-col">
                        <div className="cw-sk cw-sk-balance" />
                        <div className="cw-stat-grid">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="cw-sk cw-sk-stat" />
                            ))}
                        </div>
                        <div className="cw-sk cw-sk-timeline" />
                    </div>
                    <div className="cw-side-col">
                        <div className="cw-sk cw-sk-card" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- main component ---------- */
export default function Wallet() {
    const { profile, transactions, loading, error } = useWalletData();
    const data = normalizeProfile(profile);

    if (loading) return <Skeleton />;

    // Graceful fallback if there is truly no user available.
    if (!data) {
        return (
            <div className="cw-root">
                <div className="cw-container cw-empty-state">
                    <WalletIcon size={40} className="cw-empty-icon" />
                    <h2>We couldn't load your Civic Wallet</h2>
                    <p>
                        {error
                            ? "Something went wrong while loading your profile. Please try again."
                            : "Please sign in to view your CivicCard and points."}
                    </p>
                </div>
            </div>
        );
    }

    // Rank now lives in the hero strip, so the stat grid covers the four
    // point-based metrics without repeating it a second time.
    const stats = [
        {
            label: "Available CivicPoints",
            value: data.points,
            suffix: " CP",
            icon: Sparkles,
        },
        {
            label: "Total Earned Points",
            value: data.totalEarned,
            suffix: " CP",
            icon: TrendingUp,
        },
        {
            label: "Completed Challenges",
            value: data.challenges,
            suffix: "",
            icon: CheckCircle2,
        },
        {
            label: "Redeemed Rewards",
            value: data.redeemed,
            suffix: " CP",
            icon: Gift,
        },
    ];

    const txList = Array.isArray(transactions) ? transactions : [];

    return (
        <div className="cw-root">
            <div className="cw-container">
                {/* HERO */}
                <motion.section
                    className="cw-hero"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                >
                    <div className="cw-hero-top">
                        <span className="cw-hero-badge">
                            <WalletIcon size={15} /> CivicPlay Wallet
                        </span>
                        <a href="/rewards" className="cw-hero-quick">
                            <Gift size={16} /> Rewards
                        </a>
                    </div>

                    <h1 className="cw-hero-title">Civic Wallet</h1>
                    <p className="cw-hero-sub">
                        Your digital identity for every action that creates a better community.
                    </p>

                    <div className="cw-hero-metrics">
                        <div className="cw-hero-metric">
                            <span className="cw-hero-metric-label">Rank</span>
                            <span className="cw-hero-metric-value">{data.rank ?? "—"}</span>
                        </div>
                        <div className="cw-hero-metric">
                            <span className="cw-hero-metric-label">Impact Score</span>
                            <span className="cw-hero-metric-value">
                                {data.impactScore !== undefined && data.impactScore !== null ? (
                                    <AnimatedNumber value={data.impactScore} />
                                ) : (
                                    "—"
                                )}
                            </span>
                        </div>
                        <div className="cw-hero-metric">
                            <span className="cw-hero-metric-label">Member Since</span>
                            <span className="cw-hero-metric-value">
                                {formatDate(data.memberSince)}
                            </span>
                        </div>
                    </div>
                </motion.section>

                {/* MAIN GRID: scrolling content + sticky metal card */}
                <div className="cw-grid">
                    <div className="cw-main-col">
                        {/* Balance + stats */}
                        <motion.div
                            className="cw-panel"
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.05 }}
                        >
                            <div className="cw-balance-label">
                                <Sparkles size={15} /> Available CivicPoints
                            </div>
                            <div className="cw-balance-value">
                                {data.points !== undefined && data.points !== null ? (
                                    <>
                                        <AnimatedNumber value={data.points} /> <span>CP</span>
                                    </>
                                ) : (
                                    "—"
                                )}
                            </div>
                            <div className="cw-balance-note">
                                Keep taking civic action to unlock premium rewards.
                            </div>

                            <div className="cw-stat-grid">
                                {stats.map((s, i) => {
                                    const Icon = s.icon;
                                    const has = s.value !== undefined && s.value !== null;
                                    return (
                                        <motion.div
                                            key={s.label}
                                            className="cw-stat-card"
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                                        >
                                            <div className="cw-stat-icon">
                                                <Icon size={20} />
                                            </div>
                                            <div className="cw-stat-label">{s.label}</div>
                                            <div className="cw-stat-value">
                                                {has ? (
                                                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                                                ) : (
                                                    "—"
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* TRANSACTIONS */}
                        <section className="cw-section">
                            <div className="cw-section-head">
                                <h2 className="cw-section-title">Transaction History</h2>
                                {txList.length > 0 && (
                                    <span className="cw-tx-count">
                                        {txList.length} {txList.length === 1 ? "entry" : "entries"}
                                    </span>
                                )}
                            </div>

                            <motion.div
                                className="cw-timeline"
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                {txList.length === 0 ? (
                                    <div className="cw-tx-empty">
                                        <WalletIcon size={26} />
                                        <span>No transactions available yet</span>
                                    </div>
                                ) : (
                                    txList.map((tx, i) => {
                                        const amount = pick(tx, ["amount", "points", "value"], 0);
                                        const isPositive = Number(amount) >= 0;
                                        const title =
                                            pick(tx, ["title", "description", "label", "type"]) ??
                                            "Transaction";
                                        const date = pick(tx, [
                                            "date",
                                            "createdAt",
                                            "created_at",
                                            "timestamp",
                                        ]);
                                        const Icon = isPositive ? ArrowUpRight : ArrowDownLeft;
                                        return (
                                            <motion.div
                                                key={pick(tx, ["id", "_id"]) ?? i}
                                                className="cw-tx"
                                                initial={{ opacity: 0, x: -14 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                            >
                                                <div className={`cw-tx-icon ${isPositive ? "pos" : "neg"}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="cw-tx-body">
                                                    <div className="cw-tx-title">{title}</div>
                                                    <div className="cw-tx-meta">
                                                        {date ? new Date(date).toLocaleString() : ""}
                                                    </div>
                                                </div>
                                                <div className={`cw-tx-amount ${isPositive ? "pos" : "neg"}`}>
                                                    {isPositive ? "+" : ""}
                                                    {formatNumber(amount)} CP
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </motion.div>
                        </section>
                    </div>

                    {/* CivicCard — stays in view while the left column scrolls */}
                    <div className="cw-side-col">
                        <motion.div
                            className="cw-card-sticky"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                        >
                            <CivicCard data={data} />
                        </motion.div>
                    </div>
                </div>

                {/* REWARD CTA */}
                {/* <div className="cw-reward-wrap" id="rewards">
                    <motion.button
                        className="cw-reward-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    >
                        <Gift size={20} />
                        Explore Rewards
                    </motion.button>
                </div> */}
            </div>
        </div>
    );
}