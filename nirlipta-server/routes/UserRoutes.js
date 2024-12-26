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
} = require("../controller/UserController");

// Get all users
router.get("/", getUsers);

// Get user by ID
router.get("/getById/:id", getUserById);

// Create a new user with an optional file upload (e.g., profile picture)
router.post("/save", upload, createUser);

// Update user by ID with an optional file upload
router.put("/update/:id", upload, updateUser);

// Partially update user by ID with an optional file upload
router.patch("/patch/:id", upload, patchUser);

// Delete user by ID
router.delete("/delete/:id", deleteUser);

module.exports = router;
