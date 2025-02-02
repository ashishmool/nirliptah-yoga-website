const express = require("express");
const cors = require("cors"); // Import CORS middleware
const app = express();

// Database Connection Configuration
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const enrollmentRoutes = require("./routes/EnrollmentRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const workshopRoutes = require("./routes/WorkshopRoutes");
const workshopCategoryRoutes = require("./routes/WorkshopCategoryRoutes");
const scheduleRoutes = require("./routes/ScheduleRoutes");

const corsOptions = {
    credentials: true,
    origin: "http://localhost:5173"
}

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins
// app.use(cors(corsOptions)); // Enable CORS for frontend only

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads')); //Endpoint for Image Location

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/workshop-categories", workshopCategoryRoutes);
app.use("/api/schedules", scheduleRoutes);


// // Default route (optional)
// app.get("/", (req, res) => {
//     res.send("Welcome to the Nirliptah Server API");
// });

// Start the server
app.listen(5000, () => {
    console.log("Server started at Port 5000!");
});
