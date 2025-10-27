import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { sendEmail } from "../utils/sendMail.js";
import User from "../models/user.js";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

export const requestResetEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Если пользователя нет — всё равно возвращаем успех
        if (!user) {
            return res.status(200).json({ message: "Password reset email sent successfully" });
        }

        // Генерация JWT на 15 минут
        const token = jwt.sign(
            { sub: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Чтение шаблона письма
        const templatePath = path.join(process.cwd(), "src", "templates", "reset-password-email.html");
        const templateSource = fs.readFileSync(templatePath, "utf8");
        const template = handlebars.compile(templateSource);
        const html = template({
            name: user.name || user.email,
            resetLink: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`,
        });

        await sendEmail({ to: user.email, subject: "Reset your password", html });

        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        next(createHttpError(500, error.message));
    }
};
