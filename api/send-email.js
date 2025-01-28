import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: "POST", allowedHeaders: "Content-Type" }));

// ✅ API Route
app.post("/api/send-email", async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"BongaModels Signup" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🎉 New User Signup on BongaModels 🎉",
      html: `<p><strong>Name:</strong> ${fullName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Export the API handler
export default app;
