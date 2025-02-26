const express = require("express");
const router = express.Router();
const {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    checkEnrollmentStatus, getEnrollmentByUserId, updateEnrollmentPatch, getCertificationByStatus, generateCertificateByUserWorkshop,
} = require("../controller/EnrollmentController");
const {authorizeRole, protect} = require("../security/Auth");

// Get all enrollments
router.get("/", getAllEnrollments);

// Get certification by Status
router.get("/certification", getCertificationByStatus);
router.get("/certification/:user_id/:workshop_id", generateCertificateByUserWorkshop);

// Get enrollment by ID
router.get("/:id", getEnrollmentById);

// Get enrollment by UserID
router.get("/user/:user_id", getEnrollmentByUserId);

// Create a new enrollment
router.post("/save", createEnrollment);

// Update enrollment by ID (PUT)
router.put("/update/:id",protect, updateEnrollment);

router.patch("/status/:id",protect, updateEnrollmentPatch);

// Delete enrollment by ID
router.delete("/delete/:id", deleteEnrollment);

// Check if a user is enrolled in a specific workshop
router.get("/check/:user_id/:workshop_id", checkEnrollmentStatus); // Added this line for the check

module.exports = router;
