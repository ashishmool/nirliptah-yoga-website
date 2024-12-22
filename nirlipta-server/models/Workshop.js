const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
    {
        course_id: {
            type: mongoose.Schema.Types.ObjectId, // Primary Key
            auto: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
        },
        difficulty_level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"], // Fixed values
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discount_price: {
            type: Number,
        },
        classroom_info: {
            type: String, // Details of classroom
        },
        address: {
            type: String,
        },
        map_location: {
            type: String, // URL or coordinates
        },
        photo: {
            type: String, // URL or file path
        },
        instructor_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Instructor",
            required: false,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "WorkshopCategory", // Reference to WorkshopCategory model
            required: true,
        },
        modules: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                duration: {
                    type: Number,
                    required: true,
                    min: 1, // Minimum 1
                    validate: {
                        validator: Number.isInteger,
                        message: "Module duration must be an integer.",
                    },
                },
            },
        ],
    },
    { timestamps: true }
);

const Workshop = mongoose.model("Workshop", workshopSchema);
module.exports = Workshop;
