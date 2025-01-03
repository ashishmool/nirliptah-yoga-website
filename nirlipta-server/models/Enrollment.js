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
        },
        status: {
            type: String,
            enum: ["enrolled", "pending", "completed", "canceled"],
            default: "pending",
        },
        enrolled_at: {
            type: Date,
            default: Date.now,
        },
        completed_at: {
            type: Date,
        },
        total_price: {
            type: Number,  // Total price of the course after discounts (if applicable)
        },
        payment_status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
