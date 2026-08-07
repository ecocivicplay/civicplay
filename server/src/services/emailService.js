import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP ERROR:", err);
  } else {
    console.log("SMTP Ready");
  }
});

export async function sendOTP(email, otp) {
  console.log("Sending OTP to:", email);

  const info = await transporter.sendMail({
    from: `"CivicPlay" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CivicPlay Email Verification",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });

  console.log("Mail sent:", info.messageId);
}