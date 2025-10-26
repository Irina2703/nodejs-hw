import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { sendEmail } from "../utils/sendMail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;

export const requestResetEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Якщо користувача нема — повертаємо 200 (не виводимо що юзера немає)
        if (!user) {
            return res.status(200).json({ message: "Password reset email sent successfully" });
        }

        const token = jwt.sign({ sub: user._id.toString(), email: user.email }, JWT_SECRET, {
            expiresIn: "15m",
        });

        const templatePath = path.join(process.cwd(), "src", "templates", "reset-password-email.html");
        const templateStr = fs.readFileSync(templatePath, "utf8");
        const compiled = handlebars.compile(templateStr);

        const html = compiled({
            name: user.username || user.email,
            link: `${FRONTEND_DOMAIN}/reset-password?token=${token}`,
        });

        try {
            await sendEmail({ to: user.email, subject: "Password reset", html });
        } catch {
            // err тут не нужен — просто убираем имя переменной
            return next(createHttpError(500, "Failed to send the email, please try again later."));
        }

        return res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        let payload;

        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch {
            // убрали err, потому что он не используется
            return next(createHttpError(401, "Invalid or expired token"));
        }

        const user = await User.findOne({ _id: payload.sub, email: payload.email });
        if (!user) return next(createHttpError(404, "User not found"));

        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
};
