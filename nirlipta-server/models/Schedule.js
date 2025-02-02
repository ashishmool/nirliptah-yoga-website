const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        workshop_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Workshop",
        },
        days_of_week: [
            {
                type: String,
                enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                required: true,
            },
        ],
        start_time: {
            type: String,
            required: true,
        },
        end_time: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "paused", "canceled"],
            default: "active",
        },
    },
    { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
