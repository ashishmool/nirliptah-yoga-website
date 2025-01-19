const Schedule = require("../models/Schedule");

// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate("instructor_id workshop_id");
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedules", error });
    }
};

// Get schedule by ID
const getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findById(id).populate("instructor_id workshop_id");
        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedule by ID", error });
    }
};

// Create a new schedule
const createSchedule = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const schedule = new Schedule(req.body);
        await schedule.save();
        res.status(201).json({ message: "Schedule created successfully", schedule });
    } catch (error) {
        res.status(500).json({ message: "Error creating schedule", error });
    }
};

// Update schedule by ID
const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        res.json({ message: "Schedule updated successfully", updatedSchedule });
    } catch (error) {
        res.status(500).json({ message: "Error updating schedule", error });
    }
};

// Delete schedule by ID
const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSchedule = await Schedule.findByIdAndDelete(id);
        if (!deletedSchedule) {
            return res.status(404).json({ message: "Schedule not found" });
        }
        res.json({ message: "Schedule deleted successfully", deletedSchedule });
    } catch (error) {
        res.status(500).json({ message: "Error deleting schedule", error });
    }
};

// Get schedules by instructor_id
const getByInstructor = async (req, res) => {
    try {
        const { instructor_id } = req.params; // Extract instructor_id from request params
        const schedules = await Schedule.find({ instructor_id }).populate("instructor_id workshop_id");

        if (schedules.length === 0) {
            return res.status(404).json({ message: "No schedules found for this instructor" });
        }

        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: "Error fetching schedules by instructor ID", error });
    }
};

module.exports = {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getByInstructor,
};
