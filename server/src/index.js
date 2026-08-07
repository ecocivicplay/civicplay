import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import reportsRouter from './routes/reports.js';
import usersRouter from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import communitiesRouter from './routes/communities.js';
import notificationsRouter from './routes/notifications.js';
import adminCommunitiesRouter from './routes/adminCommunities.js';
import { sendOTP } from "./services/emailService.js";
import proofsRouter from './routes/proofs.js';

const app = express();
app.use(cors({
 origin: process.env.CLIENT_ORIGIN?.split(',').map(o => o.trim())
}));
app.use(express.json());

app.use('/api/reports', reportsRouter);
app.use('/api/proofs', proofsRouter);
app.use('/api/users', usersRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/communities', communitiesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin/communities', adminCommunitiesRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
import { db } from './firebaseAdmin.js';

app.get('/test-firestore', async (req, res) => {
    try {
        await db.collection('test').doc('hello').set({
            message: 'Firestore is working!',
            createdAt: new Date(),
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
            code: err.code,
        });
    }
});

app.get("/test-email", async (req, res) => {
  try {
    await sendOTP("eco.civicplay@gmail.com", "123456");

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));