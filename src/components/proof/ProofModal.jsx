import "./ProofModal.css";

export default function ProofModal({ proof, onClose }) {
  if (!proof) return null;

  const confidence = Math.round((proof.confidence || 0) * 100);

  return (
    <div className="proof-modal-overlay" onClick={onClose}>
      <div
        className="proof-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="proof-close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={proof.mediaUrl}
          alt={proof.activity}
          className="proof-modal-image"
        />

        <span
          className={`proof-modal-status ${
            proof.verified ? "approved" : "rejected"
          }`}
        >
          {proof.verified ? "Verified" : "Rejected"}
        </span>

        <h2>{proof.activity}</h2>

        <div className="proof-section">
          <strong>AI Reason</strong>
          <p>{proof.reason}</p>
        </div>

        <div className="proof-section">
          <strong>AI Confidence</strong>

          <div className="modal-confidence-bar">
            <div
              className="modal-confidence-fill"
              style={{
                width: `${confidence}%`,
              }}
            />
          </div>

          <span>{confidence}%</span>
        </div>

        <div className="proof-rewards">
          <div>🪙 {proof.pointsEarned}</div>
          <div>⭐ {proof.xpEarned}</div>
        </div>

        <div className="proof-date">
          {proof.createdAt
            ? new Date(proof.createdAt).toLocaleDateString()
            : ""}
        </div>
      </div>
    </div>
  );
}