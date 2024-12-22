const {
    getAllOnlineCourses,
    getOnlineCourseById,
    createOnlineCourse,
    updateOnlineCourse,
    deleteOnlineCourse
} = require("../controller/OnlineCourseController");

const express = require("express");
const router = express.Router();

// Get all online courses
router.get("/", getAllOnlineCourses);

// Get online course by ID
router.get("/:id", getOnlineCourseById);

// Create a new online course
router.post("/save", createOnlineCourse);

// Update online course by ID
router.put("/update/:id", updateOnlineCourse);

// Delete online course by ID
router.delete("/delete/:id", deleteOnlineCourse);

module.exports = router;
