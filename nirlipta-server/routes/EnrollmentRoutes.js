const express = require("express");
const router = express.Router();
const {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
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

module.exports = router;
