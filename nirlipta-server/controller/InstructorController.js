const Instructor = require("../models/Instructor");

// Get all instructors
const getAllInstructors = async (req, res) => {
    try {
        const instructors = await Instructor.find().populate("user_id");
        res.json(instructors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching instructors", error });
    }
};

// Get instructor by ID
const getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await Instructor.findById(id).populate("user_id");
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.json(instructor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching instructor by ID", error });
    }
};

// Create a new instructor
const createInstructor = async (req, res) => {
    try {
        const instructor = new Instructor(req.body);
        await instructor.save();
        res.status(201).json({ message: "Instructor created successfully", instructor });
    } catch (error) {
        res.status(500).json({ message: "Error creating instructor", error });
    }
};

// Update instructor by ID (PUT)
const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInstructor = await Instructor.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedInstructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.json({ message: "Instructor updated successfully", updatedInstructor });
    } catch (error) {
        res.status(500).json({ message: "Error updating instructor", error });
    }
};

// Delete instructor by ID
const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInstructor = await Instructor.findByIdAndDelete(id);
        if (!deletedInstructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.json({ message: "Instructor deleted successfully", deletedInstructor });
    } catch (error) {
        res.status(500).json({ message: "Error deleting instructor", error });
    }
};

module.exports = {
    getAllInstructors,
    getInstructorById,
    createInstructor,
    updateInstructor,
    deleteInstructor,
};
