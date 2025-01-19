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
        address: {
            type: String,
        },
        classroom_info: {
            type: String,
        },
        map_location: {
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
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkshopCategory",
            required: true,
        },
        photo: {
            type: String,
            default: null,
        },
        modules: [
            {
                name: {
                    type: String,
                    required: true,
                },
                duration: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const Workshop = mongoose.model("Workshop", workshopSchema);
module.exports = Workshop;
