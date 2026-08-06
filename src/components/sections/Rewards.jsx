import { useState } from "react";
import TiltCard from "../ui/TiltCard";
import SectionHeading from "../ui/SectionHeading";
import { rewards } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";
import "./Rewards.css";

const tiers = ["Tier 1", "Tier 2", "Tier 3", "Tier 4"];

export default function Rewards() {
  const { user, profile, setProfile, API_BASE } = useAuth();
  const [loading, setLoading] = useState(null);
  const handleRedeem = async (reward) => {
    if (!profile) return;

    if ((profile.points || 0) < reward.points) {
      alert("You don't have enough CivicPoints.");
      return;
    }

    try {
      setLoading(reward.id);

      const res = await fetch(
        `${API_BASE}/api/users/${user.uid}/redeem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reward }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Reward redemption failed.");
        return;
      }

      setProfile(data.profile);

      alert(`🎉 ${reward.title} redeemed successfully!`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(null);
    }
  };
  return (
    <section className="section rewards" id="rewards">
      <div
        className="blob"
        style={{
          background: "var(--accent)",
          bottom: "5%",
          left: "-5%",
          width: 320,
          height: 320,
        }}
      />

      <div className="container">
        <SectionHeading
          eyebrow="Rewards"
          title="Redeem your"
          highlight="CivicPoints"
          subtitle="Unlock real-world rewards by contributing to your city."
        />

        {tiers.map((tier) => {
          const tierRewards = rewards.filter((reward) => reward.tier === tier);

          return (
            <div key={tier} className="reward-tier">
              <h2 className="reward-tier-title">{tier}</h2>

              <div className="rewards__grid">
                {tierRewards.map((reward) => (
                  <TiltCard key={reward.id} className="reward-card">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="reward-image"
                    />

                    <div className="reward-content">
                      <span className="reward-tier-badge">
                        {reward.tier}
                      </span>

                      <h3>{reward.title}</h3>

                      <p>{reward.desc}</p>

                      <div className="reward-meta">
                        <span>
                          <strong>{reward.points}</strong> CP
                        </span>

                        <span>{reward.value}</span>
                      </div>

                      <button
                        className="reward-card__btn"
                        onClick={() => handleRedeem(reward)}
                        disabled={
                          loading === reward.id ||
                          (profile?.points || 0) < reward.points
                        }
                      >
                        {loading === reward.id
                          ? "Redeeming..."
                          : (profile?.points || 0) >= reward.points
                            ? "Redeem"
                            : "Not Enough Points"}
                      </button>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}