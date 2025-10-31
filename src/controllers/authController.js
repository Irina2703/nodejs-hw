import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { User } from "../models/user.js"; // ✅ исправленный импорт
import { sendEmail } from "../utils/sendMail.js"; // ✅ исправленный импорт

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || "http://localhost:3001";

// === Reset password email template
const templatePath = path.resolve("src/templates/reset-password-email.html");
const templateSource = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(templateSource);

// === Register user
export const registerUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return next(createHttpError(409, "User already exists"));
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashed,
            username: username || email,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: user.toJSON(),
        });
    } catch (error) {
        next(error);
    }
};

// === Login user
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(createHttpError(401, "Invalid email or password"));
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return next(createHttpError(401, "Invalid email or password"));
        }

        const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("accessToken", token, { httpOnly: true, sameSite: "none", secure: true });
        res.json({ message: "Login successful" });
    } catch (error) {
        next(error);
    }
};

// === Logout user
export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie("accessToken");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
};

// === Refresh session (simple mock)
export const refreshUserSession = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return next(createHttpError(401, "Not authenticated"));
        }

        const payload = jwt.verify(token, JWT_SECRET);
        const newToken = jwt.sign(
            { sub: payload.sub, email: payload.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("accessToken", newToken, { httpOnly: true, sameSite: "none", secure: true });
        res.status(200).json({ message: "Session refreshed" });
    } catch (error) {
        next(error);
    }
};

// === Request password reset email
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

// === Reset password
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
