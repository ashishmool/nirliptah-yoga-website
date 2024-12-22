const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
    {
        enrollment_id: {
            type: mongoose.Schema.Types.ObjectId, // Primary Key
            auto: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "User", // Reference to the User collection
            required: true,
        },
        course_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Workshop", // Reference to the Workshop collection
        },
        schedule_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Schedule", // Reference to the Schedule collection
        },
        retreat_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Retreat", // Reference to the Retreat collection
        },
        status: {
            type: String,
            enum: ["enrolled", "completed", "canceled"], // Enrollment status options
            default: "enrolled",
        },
        enrolled_at: {
            type: Date,
            default: Date.now, // Enrollment date
        },
        completed_at: {
            type: Date, // Completion date (optional)
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
