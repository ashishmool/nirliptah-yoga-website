const express = require("express");
const cors = require("cors"); // Import CORS middleware
const app = express();

// Import multer configuration from config/multerConfig.js
const upload = require('./config/multerConfig');

const connectDB = require("./config/db");

// Import routes
const accommodationRoutes = require("./routes/AccommodationRoutes");
const userRoutes = require("./routes/UserRoutes");
const enrollmentRoutes = require("./routes/EnrollmentRoutes");
const instructorRoutes = require("./routes/InstructorRoutes");
const lessonRoutes = require("./routes/LessonRoutes");
const onlineCourseRoutes = require("./routes/OnlineCourseRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const workshopRoutes = require("./routes/WorkshopRoutes");
const workshopCategoryRoutes = require("./routes/WorkshopCategoryRoutes");
const retreatRoutes = require("./routes/RetreatRoutes");
const scheduleRoutes = require("./routes/ScheduleRoutes");
const subscriptionRoutes = require("./routes/SubscriptionRoutes");
const authRoutes = require("./routes/AuthRoutes");
const fileRoutes = require("./routes/FileRoutes");
const poseRoutes = require("./routes/PoseRoutes");

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads')); //Endpoint for Image Location

// Use routes
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/onlineCourses", onlineCourseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/workshop-categories", workshopCategoryRoutes);
app.use("/api/retreats", retreatRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/poses", poseRoutes);


// Default route (optional)
app.get("/", (req, res) => {
    res.send("Welcome to the Nirliptah Server  API");
});

// Start the server
app.listen(5000, () => {
    console.log("Server started at Port 5000!");
});
