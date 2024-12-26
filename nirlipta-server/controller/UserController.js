const User = require("../models/User");
const transporter = require("../config/mailConfig");
const path = require("path");

// Helper function to handle file uploads
const getFilePath = (file) => {
    return file ? path.join("/uploads/misc", file.filename) : null;
};

// Helper function to validate environment variables
const validateEnv = () => {
    if (!process.env.EMAIL_USER) {
        throw new Error("EMAIL_USER environment variable is not set");
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Error fetching user by ID", error });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        validateEnv();

        if (req.files && req.files.user_photo) {
            req.body.photo = `/uploads/user_photos/${req.files.user_photo[0].filename}`;
        }

        const user = new User(req.body);
        await user.save();

        // Send welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Welcome to Our Platform",
            text: `Hello ${user.username}, welcome to our platform! Your user ID is ${user._id}.`,
            html: `<p>Hello <strong>${user.username}</strong>, welcome to our platform! Your user ID is <strong>${user._id}</strong>.</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Do not fail user creation if email sending fails
        }

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error });
    }
};

// Update user by ID (PUT for full update)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.files && req.files.user_photo) {
            req.body.photo = `/uploads/user_photos/${req.files.user_photo[0].filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};

// Update user by ID (PATCH for partial update)
const patchUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.files && req.files.user_photo) {
            req.body.photo = `/uploads/user_photos/${req.files.user_photo[0].filename}`;
        }

        const patchedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!patchedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User patched successfully", patchedUser });
    } catch (error) {
        console.error("Error patching user:", error);
        res.status(500).json({ message: "Error patching user", error });
    }
};

// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
};
