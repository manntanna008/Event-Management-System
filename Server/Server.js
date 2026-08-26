import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// =================================
// EMAIL CONFIGURATION
// =================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// =================================
// TEST ROUTE
// =================================

app.get("/", (req, res) => {
  res.send("Gateway Event Management Backend is running!");
});


// =================================
// TEST EMAIL
// =================================

app.get("/test-email", async (req, res) => {
  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,

      subject: "Gateway Event Management - Test Email",

      text: `
Hello!

This is a test email from Gateway Event Management System.

Your email service is working successfully.

Thank you.
      `,
    });

    res.json({
      success: true,
      message: "Test email sent successfully!",
    });

  } catch (error) {

    console.error("EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Email sending failed.",
      error: error.message,
    });

  }
});

// =================================
// REGISTRATION ROUTE
// =================================

app.post("/api/register", async (req, res) => {
  try {
    const {
      eventId,
      eventTitle,
      name,
      email,
      phone,
    } = req.body;

    if (!eventId || !eventTitle || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All registration fields are required.",
      });
    }

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,

      subject: `Registration Confirmed - ${eventTitle}`,

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #ff5a45;">
            Gateway Event Management
          </h2>

          <h3>Registration Confirmed 🎉</h3>

          <p>Hello <strong>${name}</strong>,</p>

          <p>
            Your registration has been successfully confirmed.
          </p>

          <hr>

          <p><strong>Event:</strong> ${eventTitle}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <hr>

          <p>
            Thank you for registering with Gateway Event Management.
          </p>
        </div>
      `,
    });

    console.log("Registration successful:", {
      eventId,
      eventTitle,
      name,
      email,
      phone,
    });

    res.json({
      success: true,
      message: "Registration successful! Confirmation email sent.",
    });

  } catch (error) {

    console.error("REGISTRATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// =================================
// START SERVER
// =================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Gateway backend running on http://localhost:${PORT}`
  );
});
