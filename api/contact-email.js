import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: "POST", allowedHeaders: "Content-Type" }));

// ✅ Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 📩 Contact Form API
 * Handles sending emails from the contact form.
 */
app.post("/api/contact-email", async (req, res) => {
  const { name, email, message } = req.body;

  // 🛑 Validate Required Fields
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // ✅ Email Content
    const mailOptions = {
      from: `"Contacto BongaModels" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `📩 Nuevo mensaje de contacto de ${name}`,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
          }
          .container {
            max-width: 600px;
            background: white;
            margin: auto;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: #6C133B;
            padding: 20px;
            color: white;
            font-size: 24px;
            font-weight: bold;
            border-radius: 12px 12px 0 0;
          }
          .content {
            padding: 20px;
            text-align: left;
            color: #333;
          }
          .info {
            background: #f8f8f8;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
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
            margin-top: 20px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
          }
          .footer {
            padding: 20px;
            background: #f4f4f4;
            color: #777;
            font-size: 14px;
            text-align: center;
            border-radius: 0 0 12px 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">📩 Nuevo Mensaje de Contacto</div>
          <div class="content">
            <h3>📬 Mensaje Recibido:</h3>
            <div class="info">
              <p><strong>👤 Nombre:</strong> ${name}</p>
              <p><strong>📧 Correo:</strong> ${email}</p>
              <p><strong>💬 Mensaje:</strong><br>${message}</p>
            </div>
            <a href="mailto:${email}" class="button">📧 Responder</a>
          </div>
          <div class="footer">
            ✨ Powered by <a href="https://es.bongamodels.com/">BongaModels</a> ✨
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // ✅ Send Email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ ¡Correo enviado correctamente!" });
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    res.status(500).json({ error: "❌ Error enviando el correo." });
  }
});

// ✅ Export for Vercel Deployment
export default app;
