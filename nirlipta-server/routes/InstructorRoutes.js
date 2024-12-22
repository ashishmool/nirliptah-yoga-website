const express = require("express");
const router = express.Router();
const {
    getAllInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor,
} = require("../controller/InstructorController");

// Get all instructors
router.get("/", getAllInstructors);

// Create a new instructor
router.post("/save", createInstructor);

// Get instructor by ID
router.get("/getById/:id", getInstructorById);

// Update instructor by ID
router.put("/update/:id", updateInstructor);

// Delete instructor by ID
router.delete("/delete/:id", deleteInstructor);

module.exports = router;
