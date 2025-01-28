import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { fullName, email, phone, password } = req.body;

  // ✅ Validate Required Fields
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // ✅ Validate Email Format
  const isValidEmail = /\S+@\S+\.\S+/.test(email);
  if (!isValidEmail) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    // ✅ Configure Transporter with Gmail App Password
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // ✅ Modern HTML Email Template
    let mailOptions = {
      from: `"BongaModels Signup" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // ✅ Replace with your admin email!
      subject: "🎉 New User Signup on BongaModels 🎉",
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
          <table align="center" width="600" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="background: #6C133B; padding: 25px;">
                <h2 style="color: white; margin: 0; font-size: 24px;">🎉 New User Signup 🎉</h2>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px;">
                <img src="https://i.bgmicdn.com/images/bm/popup/exit/white/x1/girl_v2.webp" alt="Welcome Image" width="280" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
                <h3 style="color: #333; text-align: center; font-size: 20px;">👤 New User Details:</h3>
                <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #444; line-height: 1.6;">
                    <strong>👤 Name:</strong> ${fullName} <br>
                    <strong>📧 Email:</strong> ${email} <br>
                    <strong>📞 Phone:</strong> ${phone} <br>
                  </p>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="mailto:${email}" style="background: #6C133B; color: white; padding: 14px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; box-shadow: 0 3px 8px rgba(0,0,0,0.2); transition: 0.3s;">
                    📧 Contact User
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px; background: #f4f4f4; color: #777; font-size: 14px;">
                <p>✨ Powered by <a href="https://es.bongamodels.com/" style="color: #6C133B; text-decoration: none; font-weight: bold;">BongaModels</a> ✨</p>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email Sending Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
