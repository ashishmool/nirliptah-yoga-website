const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workshop_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workshop",
            required: true,
        },
        payment_status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        enrollment_date: {
            type: Date,
            default: Date.now,
        },
        completion_status: {
            type: String,
            enum: ["not started", "in progress", "completed"],
            default: "not started",
        },
        feedback: {
            type: String,
        },
    },
    { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
