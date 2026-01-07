// Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors"); // Import CORS middleware
const app = express();
const rateLimiter = require("./middleware/rateLimiter");
const { sanitizeInput } = require("./middleware/validation");

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

// CORS Configuration - Security Best Practice
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Connect to the database
connectDB();

// Security Middleware
if (process.env.NODE_ENV === 'production') {
    app.use(cors(corsOptions)); // Strict CORS in production
} else {
    app.use(cors(corsOptions)); // Use configured CORS in development too
}

// Rate limiting - Only enabled in production
if (process.env.NODE_ENV === 'production') {
    app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 minutes in production
}
// Rate limiting disabled in development to avoid 429 errors during testing

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Static file serving with security headers
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        // Only serve image files
        if (path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            res.setHeader('Content-Type', 'image/jpeg');
        }
    }
}));

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

// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at Port ${PORT}!`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;