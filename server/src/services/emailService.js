import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"CivicPlay" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CivicPlay Email Verification",
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>CivicPlay Email Verification</h2>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing:5px;color:#2563eb">
          ${otp}
        </h1>

        <p>This OTP will expire in <b>5 minutes</b>.</p>

        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}