const mongoose = require("mongoose");

const poseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type:{
            type: String,
            enum: ["standing", "sitting", "balancing", "other"],
        },
        description: {
            type: String,
            required: true,
        },
        photo: {
            type: String, // URL or file path for pose image
            default: null,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

const Pose = mongoose.model("Pose", poseSchema);
module.exports = Pose;
