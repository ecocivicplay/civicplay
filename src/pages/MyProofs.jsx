import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProofs } from "../services/proofService";
import ProofCard from "../components/proof/ProofCard";
import ProofModal from "../components/proof/ProofModal";
import "./MyProofs.css";

export default function MyProofs() {
  const { user } = useAuth();

  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadProofs() {
      if (!user) return;

      try {
        const data = await getUserProofs(user.uid);
        setProofs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProofs();
  }, [user]);

  const filteredProofs = useMemo(() => {
    switch (filter) {
      case "approved":
        return proofs.filter((p) => p.verified);

      case "rejected":
        return proofs.filter((p) => !p.verified);

      default:
        return proofs;
    }
  }, [proofs, filter]);

  if (loading) {
    return (
      <div className="proof-loading">
        Loading proofs...
      </div>
    );
  }

  return (
    <div className="my-proofs-page">

      <h1>My Proofs</h1>

      <div className="proof-stats">

        <div className="stat-card">
          <h2>{proofs.length}</h2>
          <span>Total</span>
        </div>

        <div className="stat-card">
          <h2>{proofs.filter(p => p.verified).length}</h2>
          <span>Verified</span>
        </div>

        <div className="stat-card">
          <h2>{proofs.filter(p => !p.verified).length}</h2>
          <span>Rejected</span>
        </div>

      </div>

      <div className="proof-filters">

        <button
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          onClick={() => setFilter("approved")}
        >
          Approved
        </button>

        <button
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>

      </div>

      {filteredProofs.length === 0 ? (

        <div className="empty-proof">
          No proofs found.
        </div>

      ) : (

        <div className="proof-grid">

          {filteredProofs.map((proof) => (

            <ProofCard
              key={proof.proofId}
              proof={proof}
              onView={setSelectedProof}
            />

          ))}

        </div>

      )}

      <ProofModal
        proof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />

    </div>
  );
}