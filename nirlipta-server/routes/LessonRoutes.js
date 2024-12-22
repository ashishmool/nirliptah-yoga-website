const { getAllLessons, getLessonById, createLesson, updateLesson, deleteLesson } = require("../controller/LessonController");
const express = require("express");
const router = express.Router();

// Get all lessons
router.get("/", getAllLessons);

// Get lesson by ID
router.get("/:id", getLessonById);

// Create a new lesson
router.post("/save", createLesson);

// Update lesson by ID
router.put("/update/:id", updateLesson);

// Delete lesson by ID
router.delete("/delete/:id", deleteLesson);

module.exports = router;
