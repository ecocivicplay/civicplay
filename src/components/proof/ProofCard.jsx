import "./ProofCard.css";

export default function ProofCard({ proof, onView }) {
  const confidence = Math.round((proof.confidence || 0) * 100);

  return (
    <div className="proof-card">

      <div className="proof-card-image">

        {proof.mediaType === "video" ? (
          <video
            src={proof.mediaUrl}
            controls
          />
        ) : (
          <img
            src={proof.mediaUrl}
            alt={proof.activity}
          />
        )}

        <span
          className={`proof-status ${proof.verified ? "approved" : "rejected"
            }`}
        >
          {proof.verified ? "Verified" : "Rejected"}
        </span>

      </div>

      <div className="proof-card-content">

        <h3>{proof.activity || "Unknown Activity"}</h3>

        <p className="proof-reason">
          {proof.reason}
        </p>

        <div className="proof-meta">

          <div>
            🪙 <strong>{proof.pointsEarned || 250}</strong>
          </div>

          <div>
            ⭐ <strong>{proof.xpEarned || 100}</strong>
          </div>

        </div>

        <div className="proof-confidence">

          <span>AI Confidence</span>

          <div className="confidence-bar">

            <div
              className="confidence-fill"
              style={{
                width: `${confidence}%`,
              }}
            />

          </div>

          <small>{confidence}%</small>

        </div>

        <button
          className="view-proof-btn"
          onClick={() => onView(proof)}
        >
          View Details
        </button>

      </div>

    </div>
  );
}