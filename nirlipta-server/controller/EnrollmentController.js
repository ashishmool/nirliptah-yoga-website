const Enrollment = require("../models/Enrollment");

// Get all enrollments
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("user_id course_id schedule_id retreat_id"); // Populate related collections
        res.json(enrollments);
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
        const enrollment = new Enrollment(req.body); // Create a new Enrollment instance with request body data
        await enrollment.save(); // Save the enrollment in the database
        res.status(201).json({ message: "Enrollment created successfully", enrollment });
    } catch (error) {
        res.status(500).json({ message: "Error creating enrollment", error });
    }
};

// Update enrollment by ID (PUT)
const updateEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
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

module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
};
