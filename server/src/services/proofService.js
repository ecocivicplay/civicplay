import { db } from "../firebaseAdmin.js";
const COLLECTION = "proofs";
export async function saveProof({
  reportId,
  issueType,
  userId,
  mediaUrl,
  mediaType,
  activity,
  reason,
  confidence,
  verified,
  pointsEarned = 250,
  xpEarned = 100,
}) {
  console.log("saveProof() called");
  const docRef = db.collection(COLLECTION).doc();
  const proof = {
    proofId: docRef.id,
    reportId,
    issueType,
    userId,
    mediaUrl,
    mediaType,
    activity: activity || null,
    reason: reason || "",
    confidence: confidence || 0,
    verified,
    status: verified ? "approved" : "rejected",
    pointsEarned,
    xpEarned,
    createdAt: new Date(),
  };
  console.log("Saving document:", proof);
  await docRef.set(proof);
  console.log("Firestore save successful");
  return proof;
}