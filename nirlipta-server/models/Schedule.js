const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        schedule_id: {
            type: mongoose.Schema.Types.ObjectId, // Primary Key
            auto: true,
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Workshop",
            required: true,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
        },
        total_hours: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
