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
            required: true,
        },
        accommodation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accommodation",
            required: true,
        },
        selected_rooms: [
            {
                room_id: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        retreat_amount: {
            type: Number,
            required: true,
        },
        accommodation_amount: {
            type: Number,
            required: true,
        },
        total_amount: {
            type: Number,
            required: true,
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
