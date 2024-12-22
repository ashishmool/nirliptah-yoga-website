const express = require("express");
const router = express.Router();

// Role-Based Access Middleware
const { authenticateToken, authorizeRole } = require("../security/auth");

// Controllers
const accommodationRoutes = require("../routes/AccommodationRoutes");
const userRoutes = require("../routes/UserRoutes");
const enrollmentRoutes = require("../routes/EnrollmentRoutes");
const instructorRoutes = require("../routes/InstructorRoutes");
const lessonRoutes = require("../routes/LessonRoutes");
const onlineCourseRoutes = require("../routes/OnlineCourseRoutes");
const paymentRoutes = require("../routes/PaymentRoutes");
const workshopRoutes = require("../routes/WorkshopRoutes");
const retreatRoutes = require("../routes/RetreatRoutes");
const scheduleRoutes = require("../routes/ScheduleRoutes");
const subscriptionRoutes = require("../routes/SubscriptionRoutes");
const partnerRoutes = require("../routes/PartnerRoutes");
const authRoutes = require("../routes/AuthRoutes");
const fileRoutes = require("../routes/FileRoutes");

// Admin Routes
router.use("/admin", authenticateToken, authorizeRole("admin"), (req, res, next) => {
    // Only admins can access these routes
    next();
});

router.get("/admin/dashboard", AdminController.getDashboard);
router.post("/admin/retreats", AdminController.addRetreat);
router.get("/admin/retreats", AdminController.getRetreats);
router.put("/admin/retreats/:id", AdminController.updateRetreat);
router.delete("/admin/retreats/:id", AdminController.deleteRetreat);
// More admin routes can be added here...

// Instructor Routes
router.use("/instructor", authenticateToken, authorizeRole("instructor"), (req, res, next) => {
    // Only instructors can access these routes
    next();
});

router.get("/instructor/dashboard", InstructorController.getDashboard);
router.post("/instructor/workshops", InstructorController.createWorkshop);
router.get("/instructor/workshops", InstructorController.getWorkshops);
// More instructor routes can be added here...

// Student Routes
router.use("/student", authenticateToken, authorizeRole("student"), (req, res, next) => {
    // Only students can access these routes
    next();
});

router.get("/student/dashboard", StudentController.getDashboard);
router.get("/student/enrolled-courses", StudentController.getEnrolledCourses);
router.get("/student/retreats", StudentController.getRetreats);
// More student routes can be added here...

module.exports = router;
