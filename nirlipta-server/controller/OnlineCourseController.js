const OnlineCourse = require("../models/OnlineCourse");

// Get all online courses
const getAllOnlineCourses = async (req, res) => {
    try {
        const courses = await OnlineCourse.find().populate("instructor_id");
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching online courses", error });
    }
};

// Get online course by ID
const getOnlineCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await OnlineCourse.findById(id).populate("instructor_id");
        if (!course) {
            return res.status(404).json({ message: "Online course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching online course by ID", error });
    }
};

// Create a new online course
const createOnlineCourse = async (req, res) => {
    try {
        const course = new OnlineCourse(req.body);
        await course.save();
        res.status(201).json({ message: "Online course created successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Error creating online course", error });
    }
};

// Update online course by ID (PUT)
const updateOnlineCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourse = await OnlineCourse.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedCourse) {
            return res.status(404).json({ message: "Online course not found" });
        }
        res.json({ message: "Online course updated successfully", updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Error updating online course", error });
    }
};

// Delete online course by ID
const deleteOnlineCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await OnlineCourse.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Online course not found" });
        }
        res.json({ message: "Online course deleted successfully", deletedCourse });
    } catch (error) {
        res.status(500).json({ message: "Error deleting online course", error });
    }
};

module.exports = {
    getAllOnlineCourses,
    getOnlineCourseById,
    createOnlineCourse,
    updateOnlineCourse,
    deleteOnlineCourse,
};
