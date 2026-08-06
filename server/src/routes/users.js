import { Router } from 'express';
import { db } from '../firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';
import { calculateRank } from '../utils/rankSystem.js';
import { sendOTP } from "../services/emailService.js";

const router = Router();


router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const { uid, username, ...data } = req.body;
    await db.collection('users').doc(uid).set({
      ...data,
      username: username.toLowerCase(),
      createdAt: FieldValue.serverTimestamp(),
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.patch('/:uid', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.uid).set(req.body, { merge: true });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.get('/leaderboard/all', async (req, res) => {
  try {
    const snapshot = await db
      .collection('users')
      .orderBy('points', 'desc')
      .get();

    const users = snapshot.docs.map((doc, index) => {
      const data = doc.data();

      delete data.rank;

      return {
        uid: doc.id,
        ...data,
        rank: index + 1,
      };
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to load leaderboard',
    });
  }
});

router.get('/', async (req, res) => {
  try {

    const snapshot = await db
      .collection('users')
      .get();


    const users = snapshot.docs.map((doc) => {

      return {
        uid: doc.id,
        ...doc.data(),
      };

    });


    res.json(users);


  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch users",
    });

  }
});

router.get('/:uid', async (req, res) => {
  try {
    const snap = await db.collection('users').doc(req.params.uid).get();
    res.json(snap.exists ? snap.data() : {});
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch user',
      debugMessage: err.message,
      debugCode: err.code,
    });
  }
});

router.patch("/:uid/city", async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({
        error: "City required",
      });
    }

    await db.collection("users").doc(req.params.uid).set(
      {
        city,
      },
      { merge: true }
    );

    res.json({
      ok: true,
      message: "City updated",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to update city",
    });
  }
});

// Join a challenge
router.post('/:uid/challenges/:challengeId/join', async (req, res) => {
  try {
    const ref = db.collection('users').doc(req.params.uid);

    await ref.set(
      {
        takenChallengeIds: FieldValue.arrayUnion(req.params.challengeId),
        pendingChallenges: FieldValue.increment(1),
        lastActiveDate: new Date(),
      },
      { merge: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to join challenge',
    });
  }
});

router.post('/:uid/challenges/:challengeId/complete', async (req, res) => {
  try {

    const { points = 0 } = req.body;

    const ref = db.collection('users').doc(req.params.uid);

    const snap = await ref.get();

    const data = snap.exists ? snap.data() : {};

    const completed = data.completedChallengeIds || [];


    if (completed.includes(req.params.challengeId)) {
      return res.json({
        ok: true,
        alreadyCompleted: true
      });
    }


    const newStreak = (data.streak || 0) + 1;


    const rankData = calculateRank(newStreak);


    let rewards = data.rewards || [];


    if (
      rankData.reward &&
      !rewards.includes(rankData.reward)
    ) {

      rewards.push(rankData.reward);

    }


    await ref.set(
      {

        takenChallengeIds:
          FieldValue.arrayRemove(req.params.challengeId),


        completedChallengeIds:
          FieldValue.arrayUnion(req.params.challengeId),


        pendingChallenges:
          FieldValue.increment(-1),


        completedChallenges:
          FieldValue.increment(1),


        points:
          FieldValue.increment(points),


        streak:
          newStreak,


        rank:
          rankData.rank,


        rewards,


        lastActiveDate:
          new Date()


      },
      {
        merge: true
      }
    );


    res.json({
      ok: true,
      rank: rankData.rank,
      reward: rankData.reward
    });


  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Failed to complete challenge'
    });

  }
});

// Atomically mark a challenge as completed and award its points.
// Redeem Reward
router.post("/:uid/redeem", async (req, res) => {
  try {
    const { reward } = req.body;

    if (!reward) {
      return res.status(400).json({
        error: "Reward is required",
      });
    }

    const ref = db.collection("users").doc(req.params.uid);

    const snap = await ref.get();

    if (!snap.exists) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const data = snap.data();

    const currentPoints = data.points || 0;
    if (currentPoints < reward.points) {
      return res.status(400).json({
        error: "Not enough CivicPoints",
        need: reward.points - currentPoints,
      });
    }

    const redeemedReward = {
      id: reward.id,
      name: reward.title,
      image: reward.image,
      points: reward.points,
      value: reward.value,
      tier: reward.tier,
      status: "Redeemed",
      redeemedAt: new Date(),
    };

    await ref.set(
      {
        points: FieldValue.increment(-reward.points),
        redeemedRewards: FieldValue.increment(1),
        redeemedRewardHistory: FieldValue.arrayUnion(redeemedReward),
      },
      { merge: true }
    );

    const updated = await ref.get();

    res.json({
      ok: true,
      profile: updated.data(),
      reward: redeemedReward,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Reward redemption failed",
    });

  }
});

router.post("/check-username", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        available: false,
        message: "Username is required",
      });
    }

    const snapshot = await db
      .collection("users")
      .where("username", "==", username.toLowerCase())
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return res.json({
        available: false,
        message: "Username already taken",
      });
    }

    res.json({
      available: true,
      message: "Username available",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      available: false,
      message: "Server error",
    });
  }
});

router.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate new OTP every request
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const now = Date.now();

    // Store OTP in Firestore
    await db.collection("emailOtps").doc(normalizedEmail).set({
      email: normalizedEmail,
      otp,
      verified: false,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(now + 5 * 60 * 1000), // 5 minutes
    });

    // Send email
    await sendOTP(normalizedEmail, otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error("SEND EMAIL OTP ERROR:");
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/verify-email-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const docRef = db.collection("emailOtps").doc(normalizedEmail);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    const data = doc.data();

    // Check expiry
    if (new Date() > data.expiresAt.toDate()) {
      await docRef.delete();

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check OTP
    if (data.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Mark verified
    await docRef.update({
      verified: true,
      verifiedAt: FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {
    console.error("EMAIL OTP ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Award points when a report is submitted
router.post("/:uid/report-submitted", async (req, res) => {
  try {
    const ref = db.collection("users").doc(req.params.uid);

    await ref.set(
      {
        points: FieldValue.increment(50),
        reports: FieldValue.increment(1),
        lastActiveDate: new Date(),
      },
      { merge: true }
    );

    const updated = await ref.get();

    res.json({
      ok: true,
      profile: updated.data(),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to award report points",
    });
  }
});

export default router;