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
const paymentRoutes = require("./routes/PaymentRoutes");
const workshopRoutes = require("./routes/WorkshopRoutes");
const workshopCategoryRoutes = require("./routes/WorkshopCategoryRoutes");
const retreatRoutes = require("./routes/RetreatRoutes");
const authRoutes = require("./routes/AuthRoutes");

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
app.use("/api/payments", paymentRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/workshop-categories", workshopCategoryRoutes);
app.use("/api/retreats", retreatRoutes);
app.use("/api/auth", authRoutes);


// Default route (optional)
app.get("/", (req, res) => {
    res.send("Welcome to the Nirliptah Server  API");
});

// Start the server
app.listen(5000, () => {
    console.log("Server started at Port 5000!");
});
