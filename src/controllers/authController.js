import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { User } from "../models/user.js";
import { sendEmail } from "../utils/sendMail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || "http://localhost:3001";

const templatePath = path.resolve("src/templates/reset-password-email.html");
const templateSource = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(templateSource);

// ===> ВАЖЛИВО: іменований експорт
export const requestResetEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "Password reset email sent successfully" });
        }

        const payload = { sub: user._id.toString(), email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

        const resetLink = `${FRONTEND_DOMAIN}/reset-password?token=${token}`;
        const html = template({ name: user.username || user.email, link: resetLink });

        await sendEmail({
            to: user.email,
            subject: "Password reset",
            html,
        });

        return res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        next(error);
    }
};

// ===> І другий експорт
export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch {
            return next(createHttpError(401, "Invalid or expired token"));
        }

        const { sub: userId, email } = payload;
        const user = await User.findOne({ _id: userId, email });

        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
};
