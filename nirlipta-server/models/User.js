const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Primary Key
            auto: true,
        },
        name: {
            type: String,
            required: false,
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
            required: false,
            default: null,
            minlength: 8,
        },
        profile_picture: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ["student", "instructor", "admin"], // Role options
            default: "student",
        },
        dob: {
            type: Date,
            default: Date.now,
            required: false,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: null,
        },
        medical_conditions: {
            type: [String], // Array of medical conditions
            required: false,
        },
        status: {
            type: String,
            default: "pending" },
        otp: {
            type: String },
        otpExpiry: {
            type: Date }, // OTP expiry field
        enrolled_courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Workshop", // Reference to the Workshop model
                default: null, // Optional
            },
        ],
        subscribed_courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "OnlineCourse", // Reference to the OnlineCourse model
                default: null, // Optional
            },
        ],
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Payment", // Reference to the Payment model
                default: null, // Optional
            },
        ],
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

//Field OTP
