const mongoose = require("mongoose");

const retreatSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
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
        price_per_person: {
            type: Number,
            required: true,
        },
        max_participants: {
            type: Number,
        },
        address: {
            type: String,
        },
        map_location: {
            type: String, // Coordinates or Google Maps URL
        },
        meals_info: {
            type: [String],
            default: [],
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        guests: [
            {
                name: String,
                guest_photo: String,
            },
        ],
        featuring_events: {
            type: [String],
            default: [],
        },
        accommodation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Accommodation",
        },
        photo: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Retreat = mongoose.model("Retreat", retreatSchema);
module.exports = Retreat;
