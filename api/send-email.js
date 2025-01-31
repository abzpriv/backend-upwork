import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: "POST", allowedHeaders: "Content-Type" }));

// ✅ Email Transporter Configuration for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // Your Google App Password
  },
});

// 📩 **API for Signup Form Emails**
app.post("/api/send-email", async (req, res) => {
  const { firstName, lastName, email, socialUsername, screenName, gender } =
    req.body;

  if (!firstName || !lastName || !email || !screenName || !gender) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  try {
    let mailOptions = {
      from: `"BongaModels Signup" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "🎉 Nuevo registro de modelo en BongaModels 🎉",
      html: `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; background: white; margin: auto; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden; }
          .header { background: #6C133B; padding: 25px; text-align: center; color: white; font-size: 24px; }
          .content { padding: 20px; text-align: center; }
          .content img { border-radius: 10px; max-width: 280px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
          .info { background: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); text-align: left; }
          .info p { font-size: 16px; color: #444; line-height: 1.6; }
          .button { display: inline-block; background: #000; color: white; padding: 14px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; }
          .footer { padding: 20px; background: #f4f4f4; color: #777; font-size: 14px; text-align: center; }
          .footer a { color: #000; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"> 🎉 Nuevo Modelo Registrado 🎉 </div>
          <div class="content">
            <img src="https://i.bgmicdn.com/images/bm/popup/exit/white/x1/girl_v2.webp" alt="Welcome Image">
            <h3>👤 Nuevo Registro:</h3>
            <div class="info">
              <p><strong>👤 Nombre:</strong> ${firstName} ${lastName}</p>
              <p><strong>📧 Email:</strong> ${email}</p>
              <p><strong>💬 Usuario Social:</strong> ${
                socialUsername || "N/A"
              }</p>
              <p><strong>🎭 Nombre Artístico:</strong> ${screenName}</p>
              <p><strong>⚧ Género:</strong> ${gender}</p>
            </div>
            <a href="mailto:${email}" class="button">📧 Contactar Modelo</a>
          </div>
          <div class="footer"> ✨ Powered by <a href="https://es.bongamodels.com/">BongaModels</a> ✨ </div>
        </div>
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ ¡Correo enviado correctamente!" });
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    res.status(500).json({ message: "❌ Error enviando el correo." });
  }
});

// 📩 **API for Contact Form Emails**
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
      to: process.env.RECEIVER_EMAIL,
      subject: `📩 Nuevo mensaje de contacto de ${name}`,
      html: `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; background: white; margin: auto; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); }
          .header { background: #333; padding: 20px; text-align: center; color: white; font-size: 22px; }
          .content { padding: 20px; text-align: left; }
          .info { background: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
          .info p { font-size: 16px; color: #444; line-height: 1.6; }
          .footer { padding: 20px; background: #f4f4f4; color: #777; font-size: 14px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"> 📩 Nuevo Mensaje de Contacto </div>
          <div class="content">
            <h3>📬 Mensaje Recibido:</h3>
            <div class="info">
              <p><strong>👤 Nombre:</strong> ${name}</p>
              <p><strong>📧 Correo:</strong> ${email}</p>
              <p><strong>✉️ Mensaje:</strong> ${message}</p>
            </div>
          </div>
          <div class="footer"> ✨ Powered by <a href="https://es.bongamodels.com/">BongaModels</a> ✨ </div>
        </div>
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ ¡Correo enviado correctamente!" });
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    res.status(500).json({ error: "❌ Error enviando el correo." });
  }
});

// ✅ **Export for Vercel Deployment**
export default app;
