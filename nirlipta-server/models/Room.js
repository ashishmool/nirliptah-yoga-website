const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        accommodation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accommodation",
            required: true,
        },
        room_type: {
            type: String,
            required: true,
        },
        max_occupancy: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        photo: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
