const mongoose = require("mongoose");

const workshopCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const WorkshopCategory = mongoose.model("WorkshopCategory", workshopCategorySchema);
module.exports = WorkshopCategory;
