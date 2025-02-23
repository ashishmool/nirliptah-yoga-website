const User = require("../models/User");
const transporter = require("../middleware/mailConfig");
const path = require("path");
const Workshop = require("../models/Workshop");
const bcrypt = require("bcryptjs");



// Helper function to validate environment variables
const validateEnv = () => {
    if (!process.env.EMAIL_USER) {
        throw new Error("EMAIL_USER environment variable is not set");
    }
};


// Helper function to convert month number to month name
const getMonthName = (monthNumber) => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return months[monthNumber - 1]; // Subtract 1 because months are 1-indexed
};


// Get count of users with the role 'student'
const studentCount = async (req, res) => {
    try {
        // Count users with the role 'student'
        const count = await User.countDocuments({ role: "student" });

        res.status(200).json({ studentCount: count });
    } catch (error) {
        console.error("Error fetching student count:", error);
        res.status(500).json({ message: "Error fetching student count", error });
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
// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//
//         if (req.files && req.files.user_photo) {
//             req.body.photo = `/uploads/user_photos/${req.files.user_photo[0].filename}`;
//         }
//
//         const updatedUser = await User.findByIdAndUpdate(id, req.body, {
//             new: true,
//             runValidators: true,
//         });
//
//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//
//         res.status(200).json({ message: "User updated successfully", updatedUser });
//     } catch (error) {
//         console.error("Error updating user:", error);
//         res.status(500).json({ message: "Error updating user", error });
//     }
// };

// Update user by ID (PUT for full update)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // If user uploads a new photo, update the photo field
        if (req.files && req.files.user_photo) {
            req.body.photo = `/uploads/user_photos/${req.files.user_photo[0].filename}`;
        }

        // Check if password is provided and hash it
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Update user in the database
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

        // Check if password is provided and hash it
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const patchedUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body }, // Use $set for partial updates
            {
                new: true, // Return the updated document
                runValidators: true, // Enforce validation rules
            }
        );

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
// Get users by role
const getUserByRole = async (req, res) => {
    try {
        const { role } = req.params;

        console.log(req.body);
        console.log(res.body);

        // Validate the role parameter
        if (!role) {
            return res.status(400).json({ message: "Role parameter is required" });
        }

        // Find users with the specified role
        const users = await User.find({ role: role });

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found with the specified role" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users by role:", error);
        res.status(500).json({ message: "Error fetching users by role", error });
    }
};

const getUserWithEnrollments = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).lean(); // Fetch user data

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch enrollments and populate the workshop details
        const enrollments = await Enrollment.find({ user_id: userId })
            .populate("workshop_id", "name description date") // Select required fields
            .lean();

        // Extract workshop details from enrollments
        const enrolledWorkshops = enrollments.map((enrollment) => enrollment.workshop_id);

        res.json({
            ...user,
            enrolled_workshops: enrolledWorkshops, // Replace direct IDs with full workshop details
        });
    } catch (error) {
        console.error("Error fetching user enrollments:", error);
        res.status(500).json({ message: "Error fetching user enrollments", error });
    }
};



module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
    getUserByRole,
    studentCount,
    getUserWithEnrollments,
};
