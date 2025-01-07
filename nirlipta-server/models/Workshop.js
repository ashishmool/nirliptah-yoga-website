const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        difficulty_level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
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
            type: String,
        },
        address: {
            type: String,
        },
        map_location: {
            type: String,
        },
        photo: {
            type: String,
        },
        instructor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkshopCategory",
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
                    min: 1,
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
