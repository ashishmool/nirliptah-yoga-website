const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const RegistrationPasswordEmail = require("../templates/RegistrationPasswordEmail");
const ResetPasswordEmail = require("../templates/ResetPasswordEmail");
const WelcomeEmail = require("../templates/WelcomeEmail");
const transporter = require("../config/mailConfig");


require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const RESET_TOKEN_EXPIRY = "24h"; // Use string for time-based expiry with JWT

// User Registration for Web
const register = async (req, res) => {
    try {
        const { username, email, phone, role = "student" } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "Email is already registered" });
        }

        const user = new User({ username, email, phone, role, status: "pending" });
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

// Mobile Registration
const registerMobile = async (req, res) => {
    try {
        const { name, email, username, phone, password, photo, gender, medical_conditions = [], dob } = req.body;

        // Check for required fields
        if (!email || !password || !gender) {
            return res.status(400).send({ message: "Email, password, and gender are required" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "Email is already registered. Please use a different email." });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({ message: "Username is already registered. Please choose a different username." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            photo,
            username,
            phone,
            password: hashedPassword,
            gender,
            medical_conditions,
            dob,
            role: "student", // Default role for mobile users
            status: "active", // Active by default for mobile registration
        });

        // Save the user
        await user.save();

        // Generate a token for immediate session
        const token = jwt.sign(
            { user_id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "24h" }
        );

        // Send registration email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Registration Successful. Welcome!",
            html: WelcomeEmail({ name: user.name }),
        };
        await transporter.sendMail(mailOptions);

        res
            .status(201)
            .cookie("token", token) // key , value ,options
            .json({
                success: true,
                token,
            });

    } catch (error) {
        console.error("Mobile Registration Error:", error);
        res.status(500).send({ message: "Registration failed. Please try again.", error: error.message });
    }
};



// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(403).send({
                success: false,
                message: "Invalid email or password",
                statusCode: 403,
            });
        }

        // Create JWT with user details
        const token = jwt.sign(
            { user_id: user._id, email: user.email, role: user.role, photo: user.photo },
            SECRET_KEY,
            { expiresIn: "6h" }
        );

        // Send response with all necessary data
        res.status(200)
            .json({
            success: true,
            token,
            user_id: user._id,
            photo: user.photo,
            email: user.email,
            role: user.role,
            message: "Login successful",
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Login failed",
            error,
            statusCode: 500,
        });
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

        console.log("Request Body::: ", req.body);

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


const uploadImage = async (req, res, next) => {


    if (!req.file) {
        return res.status(400).send({ message: "Please upload a file" });
    }
    res.status(200).json({
        success: true,
        data: req.file.filename,
    });
}

module.exports = {
    register,
    login,
    resetPasswordRequest,
    resetPassword,
    validateSession,
    registerMobile,
    uploadImage,
};
