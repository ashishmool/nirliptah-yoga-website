const mongoose = require("mongoose");

const onlineCourseSchema = new mongoose.Schema(
    {
        online_course_id: {
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
            required: true,
        },
        total_hours: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String, // URL or file path
        },
        instructor_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Instructor",
            required: true,
        },
    },
    { timestamps: true }
);

const OnlineCourse = mongoose.model("OnlineCourse", onlineCourseSchema);
module.exports = OnlineCourse;
