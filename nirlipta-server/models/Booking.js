const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        retreat_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Retreat",
        },
        accommodation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accommodation",
        },
        no_persons: {
            type: Number,
            required: true,
            min: 1,
        },
        accommodation_amount: {
            type: Number,
            required: true,
            default: 0,
        },
        retreat_amount: {
            type: Number,
            required: true,
        },
        total_amount: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ["booked", "pending", "completed", "canceled"],
            default: "pending",
        },
        booked_on: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
