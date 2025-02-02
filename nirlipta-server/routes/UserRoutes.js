const express = require("express");
const router = express.Router();
const { upload } = require("../config/multerConfig"); // Import multer middleware
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
    getUserByRole,
} = require("../controller/UserController");
const { authenticateToken, authorizeRole, protect} = require("../security/Auth");

// Get all users
router.get("/", getUsers);

// router.get('/role/:role', getUserByRole);


// Get user by ID
router.get("/getById/:id", getUserById);
router.get("/getByRole/:role", getUserByRole);

// Create a new user with an optional file upload (e.g., profile picture)
router.post("/save", upload, createUser);

// Update user by ID with an optional file upload
router.put("/update/:id", protect, upload, updateUser);

// Partially update user by ID with an optional file upload
router.patch("/patch/:id", protect, upload, patchUser);

// Delete user by ID
router.delete("/delete/:id", protect, authenticateToken, deleteUser);

// // New routes for analytics
// router.get("/analytics/role-count", getUsersCountByRole);
// router.get("/analytics/monthly-growth", getMonthlyGrowth);

module.exports = router;
