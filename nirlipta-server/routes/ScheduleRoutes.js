const express = require("express");
const router = express.Router();
const {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    updateScheduleStatus, getScheduleByUserId,
} = require("../controller/ScheduleController");

// Get all schedules
router.get("/", getAllSchedules);

// Get schedule by ID
router.get("/:id", getScheduleById);

// Get schedule by User
router.get("/user/:id", getScheduleByUserId);

// Create a new schedule (only allowed for instructors or admins)
router.post("/save", createSchedule);

// Update schedule by ID (only allowed for instructors or admins)
router.put("/update/:id", updateSchedule);

// Delete schedule by ID (only allowed for instructors or admins)
router.delete("/delete/:id", deleteSchedule);

// Update schedule status by ID (only allowed for instructors or admins)
router.patch("/:id/status", updateScheduleStatus);

module.exports = router;
