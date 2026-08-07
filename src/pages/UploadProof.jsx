import { useState } from "react";
import CameraCapture from "../components/proof/CameraCapture";
import { uploadProofMedia } from "../services/proofUploadService";
import "./UploadProof.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Marks the passed-in challenge as completed in the user's profile using
// the existing completeChallenge logic (unchanged), once proof for it has
// been accepted/verified. No-op if this screen wasn't opened for a
// challenge, so the original report-proof flow behaves exactly as before.
async function finalizeChallengeIfAny(challenge, completeChallenge) {
  if (!challenge) return;
  try {
    await completeChallenge(challenge.id, challenge.points);
  } catch (err) {
    console.error("Failed to finalize challenge after proof:", err);
  }
}

export default function UploadProof() {

  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, completeChallenge } = useAuth();
  const report = location.state?.report || null;
  const rawChallenge = location.state?.challenge || null;
  // Only trust this as a real challenge-driven upload if it actually has a
  // valid numeric points value — guards against any stale/incorrect
  // navigation state leaking a wrong amount into the outside/report flow,
  // which must always fall back to the default 250/100.
  const challenge =
    rawChallenge && typeof rawChallenge.points === "number" ? rawChallenge : null;

  const reportId = report?.id || null;
  const issueType = report?.issueType || "";
  // When this screen is reached from a challenge's "Mark as Done" flow,
  // award that challenge's own points/xp instead of the flat default.
  const points = challenge?.points ?? undefined;
  const xp = challenge?.xp ?? undefined;

  console.log(reportId);
  console.log(issueType);

  async function handleCapture(file, type) {

    if (!user) {
      setStatus("Please login first.");
      return;
    }

    try {

      setUploading(true);
      setStatus("Uploading proof...");


      const url = await uploadProofMedia(file);


      if (type === "video") {

        setStatus("Saving video proof...");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/proofs/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              reportId,
              issueType,
              mediaUrl: url,
              type,
              userId: user.uid,
              verified: true,
              status: "approved",
              activity: "Civic Video Proof",
              confidence: 1,
              ...(points !== undefined ? { points } : {}),
              ...(xp !== undefined ? { xp } : {}),
            })
          }
        );


        const data = await response.json();

        if (data?.success) {
          await finalizeChallengeIfAny(challenge, completeChallenge);
        }

        navigate("/proof-result", {
          state: data,
        });


        return;
      }



      setStatus("Verifying proof...");


      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/proofs/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            reportId,
            issueType,
            mediaUrl: url,
            type,
            userId: user.uid,
            ...(points !== undefined ? { points } : {}),
            ...(xp !== undefined ? { xp } : {}),
          })
        }
      );


      const data = await response.json();

      if (data?.verified) {
        await finalizeChallengeIfAny(challenge, completeChallenge);
      }

      navigate("/proof-result", {
        state: data,
      });


    } catch (error) {

      console.error(error);

      setStatus(
        "Something went wrong"
      );

    } finally {

      setUploading(false);

    }

  }


  return (
    <div className="upload-proof-page">
      <div className="upload-proof-container">

        <h1>Upload Proof</h1>

        <p className="upload-proof-subtitle">
          Capture a live photo or video of your civic contribution.
        </p>

        {report && (
          <div className="selected-report">
            <h3>Selected Report</h3>

            <p>
              <strong>Issue:</strong> {report.issueType}
            </p>

            <p>
              <strong>Description:</strong> {report.description}
            </p>

            <p>
              <strong>Reporter:</strong> {report.username}
            </p>

            <p>
              <strong>Status:</strong> {report.status}
            </p>
          </div>
        )}


        {!uploading && (
          <CameraCapture
            onCaptured={handleCapture}
            onClose={() => navigate(-1)}
          />
        )}


        {status && (
          <p>
            {status}
          </p>
        )}

      </div>
    </div>
  );
}