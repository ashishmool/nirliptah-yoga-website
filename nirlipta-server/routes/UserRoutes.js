const { getUsers, getUserById, createUser, updateUser, patchUser, deleteUser } = require("../controller/UserController");
const express = require("express");
const userValidation = require("../validation/userValidation");
const { uploadSingle, uploadArray } = require("../config/multerConfig"); // Import specific upload configurations
const router = express.Router();

// Get all users
router.get("/", getUsers);

// Create a new user with an optional file upload (e.g., profile picture)
router.post("/save", uploadSingle, createUser);

// Get user by ID
router.get("/getById/:id", getUserById);

// Update user by ID with an optional file upload
router.put("/update/:id", uploadSingle, updateUser);

// Partially update user by ID with an optional file upload
router.patch("/patch/:id", uploadSingle, patchUser);

// Delete user by ID
router.delete("/delete/:id", deleteUser);

module.exports = router;
