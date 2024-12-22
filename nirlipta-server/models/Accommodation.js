const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price_per_night: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        max_occupancy: {
            type: Number,
            required: true,
        },
        available_rooms: {
            type: Number,
            required: true,
        },
        amenities: {
            type: [String], // Array of amenities
            default: [],
        },
        photo: {
            type: String, // URL or file path for accommodation image
            default: null,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

const Accommodation = mongoose.model("Accommodation", accommodationSchema);
module.exports = Accommodation;
