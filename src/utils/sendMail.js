import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendEmail = async (options) => {
    try {
        return await transporter.sendMail({ ...options });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};