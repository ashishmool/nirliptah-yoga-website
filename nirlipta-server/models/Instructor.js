const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
    {
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
            type: [String],
            default: [],
        },
        experience: {
            type: Number,
            min: 0,
            max: 30,
        },
        availability: {
            type: String,
        },
    },
    { timestamps: true }
);

const Instructor = mongoose.model("Instructor", instructorSchema);
module.exports = Instructor;
