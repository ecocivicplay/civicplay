import express from "express";
import { verifyCivicAction } from "../services/qwenVisionService.js";
import { saveProof } from "../services/proofService.js";
import { rewardUser } from "../services/rewardService.js";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const {
      reportId,
      issueType,
      mediaUrl,
      type,
      userId,
      // Points/xp for the specific challenge being verified. Falls back to
      // the old flat 250/100 so any existing caller that doesn't send these
      // keeps working exactly as before.
      points = 250,
      xp = 100,
    } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({
        success: false,
        message: "Media URL required",
      });
    }

    // AI Verification
    const result = await verifyCivicAction(mediaUrl);

    // Save proof in Firestore
    const savedProof = await saveProof({
      reportId,
      issueType,
      userId,
      mediaUrl,
      mediaType: type,
      activity: result.activity,
      reason: result.reason,
      confidence: result.confidence,
      verified: result.verified,
      pointsEarned: result.verified ? points : 0,
      xpEarned: result.verified ? xp : 0,
    });

    const rewards = await rewardUser(userId, result.verified, points, xp);
    if (result.verified && reportId) {
      await db
        .collection("reports")
        .doc(reportId)
        .update({
          status: "Resolved",
          proofId: savedProof.proofId,
          resolvedBy: userId,
          resolvedAt: new Date(),
        });
    }

    // If AI rejected
    if (!result.verified) {
      return res.json({
        success: false,
        verified: false,
        message: result.reason || "Proof rejected by AI verification",
        aiResult: result,
        proof: savedProof,
        rewards,
      });
    }

    // If AI approved
    return res.json({
      success: true,
      verified: true,
      message: "Proof verified successfully",
      mediaUrl,
      type,
      userId,
      aiResult: result,
      proof: savedProof,
      rewards,
    });

  } catch (error) {
    console.error("Proof verification error:", error);

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

router.post("/save", async (req, res) => {

  try {

    const {
      reportId,
      issueType,
      mediaUrl,
      type,
      userId,
      verified,
      status,
      activity,
      confidence,
      // Points/xp for the specific challenge being verified. Falls back to
      // the old flat 250/100 so any existing caller that doesn't send these
      // keeps working exactly as before.
      points = 250,
      xp = 100,
    } = req.body;


    if (!mediaUrl || !userId) {
      return res.status(400).json({
        success: false,
        message: "Media URL and userId required"
      });
    }


    const proof = {
      reportId,
      issueType,
      userId,
      mediaUrl,
      mediaType: type,
      activity: activity || "Video Proof",
      confidence: confidence || 1,
      verified: verified ?? true,
      status: status || "approved",
      createdAt: new Date(),
      xpEarned: xp,
      pointsEarned: points,
    };


    const docRef = await db
      .collection("proofs")
      .add(proof);


    return res.json({
      success: true,
      verified: true,
      proof: {
        proofId: docRef.id,
        ...proof
      },
      rewards: {
        points,
        xp
      }
    });


  } catch (error) {

    console.error("Save proof error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save proof"
    });

  }

});

router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Note: intentionally no .orderBy() chained onto the .where() here —
    // that combination needs a composite Firestore index, and if one
    // hasn't been created in the console the query throws and this
    // endpoint 500s. Sorting in memory avoids that requirement.
    const snapshot = await db
      .collection("proofs")
      .where("userId", "==", uid)
      .get();

    const proofs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aTime = a.createdAt?._seconds ?? a.createdAt?.seconds ?? 0;
        const bTime = b.createdAt?._seconds ?? b.createdAt?.seconds ?? 0;
        return bTime - aTime;
      });

    return res.json({
      success: true,
      proofs,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch proofs",
    });
  }
});

export default router;