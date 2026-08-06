import { db } from "../firebaseAdmin.js";
const USERS = "users";

export async function rewardUser(userId, verified, points = 250, xp = 100) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const userRef = db.collection(USERS).doc(userId);
    const snap = await userRef.get();

    if (!snap.exists) {
        throw new Error("User not found");
    }

    const user = snap.data();

    const updateData = {};

    if (verified) {
        updateData.verifiedProofs = (user.verifiedProofs || 0) + 1;
        updateData.completedProofs = (user.completedProofs || 0) + 1;

        updateData.points = (user.points || 0) + points;
        updateData.xp = (user.xp || 0) + xp;

        updateData.streak = (user.streak || 0) + 1;

        updateData.lastProofDate = new Date();
    } else {
        updateData.rejectedProofs = (user.rejectedProofs || 0) + 1;
    }

    await userRef.update(updateData);

    return updateData;
}