import { useLocation, useNavigate } from "react-router-dom";
import "./ProofResult.css";

export default function ProofResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  const {
    verified,
    aiResult,
    proof,
    rewards,
  } = state;

  return (
    <div className="proof-result-page">
      <div className="proof-result-card">

        <div className="proof-icon">
          {verified ? "🎉" : "❌"}
        </div>

        <h1>
          {verified
            ? "Proof Verified!"
            : "Proof Rejected"}
        </h1>

        <p className="proof-message">
          {verified
            ? "Your civic contribution has been successfully verified."
            : aiResult?.reason}
        </p>

        {verified && (
          <div className="reward-box">

            <h2>Rewards Earned</h2>

            <div className="reward-item">
              🪙 +{rewards?.points ?? proof?.pointsEarned ?? 0} Civic Points
            </div>

            <div className="reward-item">
              ⭐ +{rewards?.xp ?? proof?.xpEarned ?? 0} XP
            </div>

          </div>
        )}

        <div className="details">

          <p>
            <strong>Activity:</strong>{" "}
            {proof?.activity || "N/A"}
          </p>

          <p>
            <strong>Confidence:</strong>{" "}
            {Math.round((proof?.confidence || 0) * 100)}%
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {proof?.status}
          </p>

        </div>

        <div className="proof-buttons">

          <button
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/my-proofs")}
          >
            My Proofs
          </button>

        </div>

      </div>
    </div>
  );
}