const { getAllSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } = require("../controller/ScheduleController");
const express = require("express");
const router = express.Router();

// Get all schedules
router.get("/", getAllSchedules);

// Get schedule by ID
router.get("/:id", getScheduleById);

// Create a new schedule
router.post("/save", createSchedule);

// Update schedule by ID
router.put("/update/:id", updateSchedule);

// Delete schedule by ID
router.delete("/delete/:id", deleteSchedule);

module.exports = router;
