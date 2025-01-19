const express = require("express");
const cors = require("cors"); // Import CORS middleware
const app = express();

// Import multer configuration from config/multerConfig.js
const upload = require('./config/multerConfig');

const connectDB = require("./config/db");

// Import routes
const accommodationRoutes = require("./routes/AccommodationRoutes");
const roomRoutes = require("./routes/RoomRoutes");
const userRoutes = require("./routes/UserRoutes");
const enrollmentRoutes = require("./routes/EnrollmentRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const workshopRoutes = require("./routes/WorkshopRoutes");
const workshopCategoryRoutes = require("./routes/WorkshopCategoryRoutes");
const retreatRoutes = require("./routes/RetreatRoutes");
const authRoutes = require("./routes/AuthRoutes");
const scheduleRoutes = require("./routes/ScheduleRoutes");
const bookingRoutes = require("./routes/BookingRoutes");

const corsOptions = {
    credentials: true,
    origin: "http://localhost:5173"
}

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads')); //Endpoint for Image Location

// Use routes
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/workshop-categories", workshopCategoryRoutes);
app.use("/api/retreats", retreatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);


// Default route (optional)
app.get("/", (req, res) => {
    res.send("Welcome to the Nirliptah Server  API");
});

// Start the server
app.listen(5000, () => {
    console.log("Server started at Port 5000!");
});
