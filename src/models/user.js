import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String },
    password: { type: String, required: true },
    avatar: {
        type: String,
        default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
    },
});

userSchema.pre("save", function (next) {
    if (!this.username) this.username = this.email;
    next();
});

// (якщо ще не маєш хешування на save — зазвичай хешують пароль при створенні)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
