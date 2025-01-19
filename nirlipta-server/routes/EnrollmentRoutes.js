const express = require("express");
const router = express.Router();
const {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    checkEnrollmentStatus, // Add the check enrollment status controller here
} = require("../controller/EnrollmentController");

// Get all enrollments
router.get("/", getAllEnrollments);

// Get enrollment by ID
router.get("/:id", getEnrollmentById);

// Create a new enrollment
router.post("/save", createEnrollment);

// Update enrollment by ID (PUT)
router.put("/update/:id", updateEnrollment);

// Delete enrollment by ID
router.delete("/delete/:id", deleteEnrollment);

// Check if a user is enrolled in a specific workshop
router.get("/check/:user_id/:workshop_id", checkEnrollmentStatus); // Added this line for the check

module.exports = router;
