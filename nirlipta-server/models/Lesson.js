const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        lesson_id: {
            type: mongoose.Schema.Types.ObjectId, // Primary Key
            auto: true,
        },
        online_course_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "OnlineCourse", // Reference to OnlineCourse model
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        video_url: {
            type: String, // URL of the video
            required: true,
        },
        is_free: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number, // Duration in minutes
        },
        order: {
            type: Number, // Order of the lesson in the course
        },
    },
    { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
