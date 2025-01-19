const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["workshop", "retreat"],
            required: true,
        },
        reference_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "type", // Dynamically refers to either "Workshop" or "Retreat"
        },
        date: {
            type: Date,
            required: true,
        },
        start_time: {
            type: String,
            required: true,
        },
        end_time: {
            type: String,
            required: true,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        notes: {
            type: String,
        },
        location: {
            type: String,
        },
        status: {
            type: String,
            enum: ["upcoming", "completed", "canceled"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
