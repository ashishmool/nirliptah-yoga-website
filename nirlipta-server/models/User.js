const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
            trim: true,
        },
        username: {
            type: String,
            unique: false,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            minlength: 8,
            default: null,
        },
        photo: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ["student", "instructor", "admin"],
            default: "student",
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        medical_conditions: {
            type: [String], // List of medical conditions
            default: [],
        },
        status: {
            type: String,
            enum: ["active", "pending", "inactive", "verified"],
            default: "pending",
        },
        enrolled_workshops: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Workshop",
            },
        ],
        booked_retreats: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Retreat",
            },
        ],
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Payment",
            },
        ],
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
