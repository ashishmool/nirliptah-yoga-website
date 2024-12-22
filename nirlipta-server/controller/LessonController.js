const Lesson = require("../models/Lesson");

// Get all lessons
const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find().populate("online_course_id");
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: "Error fetching lessons", error });
    }
};

// Get lesson by ID
const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id).populate("online_course_id");
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: "Error fetching lesson by ID", error });
    }
};

// Create a new lesson
const createLesson = async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        await lesson.save();
        res.status(201).json({ message: "Lesson created successfully", lesson });
    } catch (error) {
        res.status(500).json({ message: "Error creating lesson", error });
    }
};

// Update lesson by ID (PUT)
const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedLesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        res.json({ message: "Lesson updated successfully", updatedLesson });
    } catch (error) {
        res.status(500).json({ message: "Error updating lesson", error });
    }
};

// Delete lesson by ID
const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLesson = await Lesson.findByIdAndDelete(id);
        if (!deletedLesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        res.json({ message: "Lesson deleted successfully", deletedLesson });
    } catch (error) {
        res.status(500).json({ message: "Error deleting lesson", error });
    }
};

module.exports = {
    getAllLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
};
