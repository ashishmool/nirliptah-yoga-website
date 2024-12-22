const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
    {
        instructor_id: {
            type: mongoose.Schema.Types.ObjectId, // Primary Key
            auto: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "User",
            required: false,
        },
        name: {
            type: String,
        },
        bio: {
            type: String,
            trim: true,
        },
        specialization: {
            type: [String], // Array of specializations
            default: [],
        },
        rating: {
            type: Number, // Average rating
            min: 0,
            max: 5,
        },
        availability: {
            type: String, // E.g., "Mon-Fri: 9AM-5PM"
        },
    },
    { timestamps: true } // Adds `created_at` and `updated_at`
);

const Instructor = mongoose.model("Instructor", instructorSchema);
module.exports = Instructor;
