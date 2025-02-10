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
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
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
            required: true,
            enum: ["student", "admin"],
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
            required: true,
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
