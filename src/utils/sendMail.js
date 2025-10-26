import nodemailer from "nodemailer";
import createHttpError from "http-errors";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error("Missing SMTP environment variables");
}

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: SMTP_FROM,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Email sending error:", error.message);
        throw createHttpError(500, "Failed to send the email, please try again later.");
    }
};
