const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const RegistrationPasswordEmail = require("../config/RegistrationPasswordEmail");
const ResetPasswordEmail = require("../config/ResetPasswordEmail");
const transporter = require("../config/mailConfig");

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const RESET_TOKEN_EXPIRY = "1h"; // Use string for time-based expiry with JWT

// User Registration for Web
const register = async (req, res) => {
    try {
        const { name, email, role = "student" } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "Email is already registered" });
        }

        const user = new User({ name, email, role, status: "pending" });
        await user.save();

        const resetToken = jwt.sign({ user_id: user._id }, SECRET_KEY, { expiresIn: RESET_TOKEN_EXPIRY });
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // Send registration email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Complete Your Registration",
            html: RegistrationPasswordEmail({ email: user.email, resetLink }),
        };
        await transporter.sendMail(mailOptions);

        res.status(201).send({ message: "Registration email sent. Please complete the process." });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send({ message: "Registration failed", error });
    }
};


// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(403).send({ message: "Invalid email or password" });
        }

        // Create JWT with user details
        const token = jwt.sign(
            { user_id: user._id, email: user.email, role: user.role, photo: user.photo },
            SECRET_KEY,
            { expiresIn: "6h" }
        );

        // Send response with all necessary data
        res.json({
            token,
            user_id: user._id,
            photo: user.photo,
            email: user.email,
            role: user.role,
            message: "Login successful",
        });
    } catch (error) {
        res.status(500).send({ message: "Login failed", error });
    }
};

// Request Password Reset - Generate a Reset Token and send via email
const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Create a reset token (expires in 1 hour)
        const resetToken = jwt.sign({ user_id: user._id }, SECRET_KEY, { expiresIn: RESET_TOKEN_EXPIRY });

        // Construct reset link
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // In your email sending logic
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: ResetPasswordEmail({ email: user.email, resetLink }),
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Error in sending reset email", error: error.message });
    }
};

// Reset Password for Web
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify the reset token
        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return res.status(400).send({ message: "Invalid or expired reset token" });
        }

        // Find the user associated with the token
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Hash the new password and update the user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.status = "verified";
        // Save the updated user
        await user.save();

        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error resetting password", error });
    }
};

// Validate Session
const validateSession = async (req, res) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }

        const verified = jwt.verify(token, SECRET_KEY);

        if (!verified) {
            return res.status(401).send({ message: "Invalid or expired token" });
        }

        res.status(200).send({ message: "Token is valid", user: verified });
    } catch (error) {
        res.status(401).send({ message: "Invalid or expired token", error });
    }
};

module.exports = {
    register,
    login,
    resetPasswordRequest,
    resetPassword,
    validateSession,
};
