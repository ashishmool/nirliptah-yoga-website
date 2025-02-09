const Enrollment = require("../models/Enrollment");
const User = require("../models/User");



// Get all enrollments
const getAllEnrollments = async (req, res) => {
    try {
        console.log("GET /api/enrollments");
        const enrollments = await Enrollment.find()
            .populate("user_id workshop_id"); // Populate related collections

        res.json({
            enrollments,
            count: enrollments.length
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrollments", error });
    }
};



// Get enrollment by ID
const getEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await Enrollment.findById(id)
            .populate("user_id course_id schedule_id retreat_id");
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrollment by ID", error });
    }
};

// Create a new enrollment
const createEnrollment = async (req, res) => {
    try {
        const { user_id, workshop_id } = req.body; // Extract user_id and workshop_id from request body

        if (!user_id || !workshop_id) {
            return res.status(400).json({ message: "User ID and Workshop ID are required." });
        }

        // Check if the user is already enrolled in the workshop
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user has already enrolled in this workshop
        if (user.enrolled_workshops.includes(workshop_id)) {
            return res.status(400).json({ message: "You have already enrolled in this workshop." });
        }

        // Create a new enrollment record
        const enrollment = new Enrollment({
            user_id,
            workshop_id,
            payment_status: "pending", // Set payment status to "pending"
        });

        // Save the enrollment to the database
        await enrollment.save();

        // Add the workshop to the user's enrolled workshops array
        user.enrolled_workshops.push(workshop_id);

        // Save the user document after adding the workshop to the enrolled_workshops array
        await user.save();

        // Respond with success message and enrollment data
        res.status(201).json({ message: "Enrollment created successfully", enrollment });

    } catch (error) {
        console.error("Error creating enrollment:", error);
        res.status(500).json({ message: "Error creating enrollment", error });
    }
};

// Check if a user is already enrolled in a specific workshop
const checkEnrollmentStatus = async (req, res) => {
    try {
        const { user_id, workshop_id } = req.params;

        if (!user_id || !workshop_id) {
            return res.status(400).json({ message: "User ID and Workshop ID are required." });
        }

        // Check if the user is enrolled in this specific workshop
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the user is already enrolled in the workshop
        const isEnrolled = user.enrolled_workshops.includes(workshop_id);

        res.json({ enrolled: isEnrolled });
    } catch (error) {
        console.error("Error checking enrollment status:", error);
        res.status(500).json({ message: "Error checking enrollment status", error });
    }
};

// Update enrollment by ID (PUT)
const updateEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, workshop_id } = req.body;

        // You can add checks for user and workshop before updating enrollment
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if user is enrolled in the workshop already
        if (user.enrolled_workshops.includes(workshop_id)) {
            return res.status(400).json({ message: "User is already enrolled in this workshop." });
        }

        const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Run validation on the update
        });
        if (!updatedEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json({ message: "Enrollment updated successfully", updatedEnrollment });
    } catch (error) {
        res.status(500).json({ message: "Error updating enrollment", error });
    }
};

// Delete enrollment by ID
const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEnrollment = await Enrollment.findByIdAndDelete(id); // Find and delete by ID
        if (!deletedEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json({ message: "Enrollment deleted successfully", deletedEnrollment });
    } catch (error) {
        res.status(500).json({ message: "Error deleting enrollment", error });
    }
};

// Get enrollments by user ID
const getEnrollmentByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;
        console.log(user_id);

        // Validate user_id
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Find enrollments for the given user ID
        const enrollments = await Enrollment.find({ user_id })
            .populate("workshop_id"); // Populate related collections

        if (!enrollments.length) {
            return res.status(404).json({ message: "No enrollments found for this user." });
        }

        res.json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments by user ID:", error);
        res.status(500).json({ message: "Error fetching enrollments", error });
    }
};

// Update enrollment by ID (PATCH) - Partial Update
const updateEnrollmentPatch = async (req, res) => {
    try {
        console.log("Reached Here");
        const { id } = req.params;
        const updateFields = req.body; // Only update fields provided in the request

        // Find and update the enrollment with the provided fields
        const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, { $set: updateFields }, {
            new: true, // Return the updated document
            runValidators: true // Ensure validation rules are applied
        });

        if (!updatedEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.json({ message: "Enrollment updated successfully", updatedEnrollment });
    } catch (error) {
        console.error("Error updating enrollment (PATCH):", error);
        res.status(500).json({ message: "Error updating enrollment", error });
    }
};



module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    checkEnrollmentStatus, // Added the new method here
    getEnrollmentByUserId,
    updateEnrollmentPatch,
};
