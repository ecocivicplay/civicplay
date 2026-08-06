import { Router } from 'express';
import { db } from '../firebaseAdmin.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const usersSnap = await db.collection('users').get();
        const reportsSnap = await db.collection('reports').get();

        const totalUsers = usersSnap.size;

        let pendingReports = 0;
        let solvedReports = 0;
        let waitingReview = 0;

        reportsSnap.forEach((doc) => {
            const report = doc.data();

            const status = (report.status || '').toLowerCase();

            if (status === 'pending') {
                pendingReports++;
            } else if (status === 'reported') {
                waitingReview++;
            } else if (status === 'solved') {
                solvedReports++;
            }
        });

        res.json({
            ok: true,
            stats: {
                totalUsers,
                pendingReports,
                solvedReports,
                waitingReview
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
});
export default router;