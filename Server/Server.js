import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// =================================
// RESEND EMAIL CONFIGURATION
// =================================

const resend = new Resend(process.env.RESEND_API_KEY);


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

    const { data, error } = await resend.emails.send({
      from: "Gateway Event Management <onboarding@resend.dev>",
      to: [process.env.EMAIL_USER],

      subject: "Gateway Event Management - Test Email",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #ff5a45;">
            Gateway Event Management
          </h2>

          <h3>Test Email Successful 🎉</h3>

          <p>
            Your email service is working successfully.
          </p>

          <p>
            This email was sent using Resend API.
          </p>

          <hr>

          <p>Thank you.</p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Email sending failed.",
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Test email sent successfully!",
      id: data?.id,
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


    // ===============================
    // VALIDATION
    // ===============================

    if (
      !eventId ||
      !eventTitle ||
      !name ||
      !email ||
      !phone
    ) {

      return res.status(400).json({
        success: false,
        message: "All registration fields are required.",
      });

    }


    // ===============================
    // SEND CONFIRMATION EMAIL
    // ===============================

    const { data, error } = await resend.emails.send({

      from: "Gateway Event Management <onboarding@resend.dev>",

      to: [email],

      subject: `Registration Confirmed - ${eventTitle}`,

      html: `
        <div
          style="
            font-family: Arial;
            padding: 20px;
            max-width: 600px;
            margin: auto;
          "
        >

          <h2 style="color: #ff5a45;">
            Gateway Event Management
          </h2>

          <h3>Registration Confirmed 🎉</h3>

          <p>
            Hello <strong>${name}</strong>,
          </p>

          <p>
            Your registration has been successfully confirmed.
          </p>

          <hr>

          <p>
            <strong>Event:</strong> ${eventTitle}
          </p>

          <p>
            <strong>Name:</strong> ${name}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Phone:</strong> ${phone}
          </p>

          <hr>

          <p>
            Thank you for registering with
            Gateway Event Management.
          </p>

        </div>
      `,
    });


    // ===============================
    // RESEND ERROR
    // ===============================

    if (error) {

      console.error(
        "RESEND REGISTRATION ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Registration email could not be sent.",

        error: error.message,

      });

    }


    // ===============================
    // SUCCESS
    // ===============================

    console.log(
      "Registration successful:",
      {
        eventId,
        eventTitle,
        name,
        email,
        phone,
        emailId: data?.id,
      }
    );


    res.json({

      success: true,

      message:
        "Registration successful! Confirmation email sent.",

      emailId: data?.id,

    });


  } catch (error) {

    console.error(
      "REGISTRATION ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Registration failed.",

      error: error.message,

    });

  }

});


// =================================
// START SERVER
// =================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `Gateway backend running on port ${PORT}`
  );

});