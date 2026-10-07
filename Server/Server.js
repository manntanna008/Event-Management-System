import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// GMAIL SMTP
// ===============================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.send("Gateway Event Management Backend Running");
});


// ===============================
// TEST EMAIL
// ===============================

app.get("/test-email", async (req, res) => {

    try {

        const info = await transporter.sendMail({
            from: `"Gateway Event Management" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "Test Email - Gateway Event Management",
            html: `
                <h2>Test Email Successful! ✅</h2>
                <p>Gmail SMTP is working correctly.</p>
            `
        });

        console.log("TEST EMAIL SENT:", info.messageId);

        res.json({
            success: true,
            message: "Test email sent successfully!",
            id: info.messageId
        });

    } catch (error) {

        console.error("TEST EMAIL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Test email failed",
            error: error.message
        });
    }
});


// ===============================
// EVENT REGISTRATION
// ===============================

app.post("/api/register", async (req, res) => {

    const {
        eventId,
        eventTitle,
        name,
        email,
        phone
    } = req.body;


    try {

        const info = await transporter.sendMail({

            from: `"Gateway Event Management" <${process.env.EMAIL_USER}>`,

            to: email,

            subject: `Registration Confirmed - ${eventTitle}`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 25px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                ">

                    <h2 style="color: #2563eb;">
                        Registration Confirmed 🎉
                    </h2>

                    <p>Hello <b>${name}</b>,</p>

                    <p>
                        Your registration for the following event has been
                        successfully confirmed.
                    </p>

                    <hr>

                    <h3>Event Details</h3>

                    <p>
                        <b>Event:</b> ${eventTitle}
                    </p>

                    <p>
                        <b>Event ID:</b> ${eventId}
                    </p>

                    <p>
                        <b>Name:</b> ${name}
                    </p>

                    <p>
                        <b>Email:</b> ${email}
                    </p>

                    <p>
                        <b>Phone:</b> ${phone}
                    </p>

                    <hr>

                    <p>
                        Thank you for registering with
                        <b>Gateway Event Management</b>.
                    </p>

                    <p>
                        We look forward to seeing you at the event!
                    </p>

                </div>
            `
        });


        console.log("REGISTRATION EMAIL SENT:", info.messageId);


        res.json({
            success: true,
            message: "Registration successful and confirmation email sent!",
            id: info.messageId
        });


    } catch (error) {

        console.error("REGISTRATION EMAIL ERROR:", error);


        res.status(500).json({
            success: false,
            message: "Registration email could not be sent.",
            error: error.message
        });
    }
});


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Gateway backend running on http://localhost:${PORT}`
    );

});