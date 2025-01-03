const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            minlength: 8,
            default: null
        },
        photo: {
            type: String
        },
        role: {
            type: String,
            enum: ["student", "instructor", "admin"],
            default: "student"
        },
        dob: {
            type: Date
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },
        medical_conditions: {
            type: [String]
        },
        status: {
            type: String,
            default: "pending"
        },
        enrolled_courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Workshop"
            }
        ],
        booked_retreats: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Retreat"
            }
        ],
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Payment"
            }
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
