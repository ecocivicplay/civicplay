import { FiCamera, FiMapPin, FiX } from "react-icons/fi";
import "./ProofActionModal.css";

export default function ProofActionModal({
  open,
  onClose,
  onSpotIssue,
  onUploadProof,
}) {
  if (!open) return null;

  return (
    <>
      <div className="proof-modal-overlay" onClick={onClose} />

      <div className="proof-modal">
        <div className="proof-modal-handle" />

        <div className="proof-modal-header">
          <h2>Choose Action</h2>

          <button
            className="proof-close-btn"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <button
          className="proof-action-card"
          onClick={onUploadProof}
        >
          <div className="proof-icon green">
            <FiCamera />
          </div>

          <div>
            <h3>Upload Proof</h3>
            <p>
              Upload proof of civic activity and earn 250 points after AI
              verification.
            </p>
          </div>
        </button>

        <button
          className="proof-action-card"
          onClick={onSpotIssue}
        >
          <div className="proof-icon blue">
            <FiMapPin />
          </div>

          <div>
            <h3>Spot Issue</h3>
            <p>
              Report garbage or another civic issue using the existing report
              system.
            </p>
          </div>
        </button>

        <button
          className="proof-cancel"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </>
  );
}