const User = require("../models/User");
const transporter = require("../config/mailConfig");
const path = require("path");
const Workshop = require("../models/Workshop");


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


// Get monthly growth data
const getMonthlyGrowth = async (req, res) => {
    try {
        // Fetch all users and workshops grouped by month
        const usersByMonth = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month of creation
                    count: { $sum: 1 }, // Count users per month
                },
            },
            {
                $project: {
                    month: "$_id", // Rename _id to month
                    users: "$count", // Rename count to users
                    _id: 0, // Exclude _id from the output
                },
            },
            { $sort: { month: 1 } }, // Sort by month (1 = January, 2 = February, etc.)
        ]);

        const workshopsByMonth = await Workshop.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month of creation
                    count: { $sum: 1 }, // Count workshops per month
                },
            },
            {
                $project: {
                    month: "$_id", // Rename _id to month
                    workshops: "$count", // Rename count to workshops
                    _id: 0, // Exclude _id from the output
                },
            },
            { $sort: { month: 1 } }, // Sort by month (1 = January, 2 = February, etc.)
        ]);

        // Combine the data into a single array
        const monthlyGrowth = usersByMonth.map((userMonth) => {
            const workshopMonth = workshopsByMonth.find(
                (workshop) => workshop.month === userMonth.month
            );
            return {
                month: getMonthName(userMonth.month), // Convert month number to name
                users: userMonth.users,
                workshops: workshopMonth ? workshopMonth.workshops : 0,
            };
        });

        res.status(200).json(monthlyGrowth);
    } catch (error) {
        console.error("Error fetching monthly growth data:", error);
        res.status(500).json({ message: "Error fetching monthly growth data", error });
    }
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

// // Get count of users by role
// const getUsersCountByRole = async (req, res) => {
//     try {
//         const roleCounts = await User.aggregate([
//             { $group: { _id: "$role", count: { $sum: 1 } } },
//             { $project: { role: "$_id", count: 1, _id: 0 } },
//         ]);
//
//         res.status(200).json(roleCounts);
//     } catch (error) {
//         console.error("Error fetching users count by role:", error);
//         res.status(500).json({ message: "Error fetching users count by role", error });
//     }
// };

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
    getUserByRole,
    getMonthlyGrowth,
    studentCount,
};
