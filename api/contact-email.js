import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: "POST", allowedHeaders: "Content-Type" }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "recent:" + process.env.EMAIL_USER, // ✅ Add "recent:" before your email
    pass: process.env.EMAIL_PASS,
  },
});

// 📩 Contact Form API
app.post("/api/contact-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const mailOptions = {
      from: `"Contacto BongaModels" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL, // Receiver's email
      bcc: process.env.EMAIL_USER, // ✅ Add your email here
      subject: `📩 Nuevo mensaje de contacto de ${name}`,
      html: `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Correo:</strong> ${email}</p>
    <p><strong>Mensaje:</strong><br>${message}</p>
  `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ ¡Correo enviado correctamente!" });
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    res.status(500).json({ error: "❌ Error enviando el correo." });
  }
});

// ✅ Export for Vercel Deployment
export default app;
