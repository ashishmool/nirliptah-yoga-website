const { getUsers, getUserById, createUser, updateUser, patchUser, deleteUser } = require("../controller/UserController");
const express = require("express");
const userValidation = require("../validation/userValidation");
const upload = require("../config/multerConfig");
const router = express.Router();

// Get all users
// router.get("/", authorization, authorizeRole("ADMIN"), getUsers);
router.get("/", getUsers);

// Create a new user
router.post("/save", upload,  createUser);
// router.post("/save", userValidation, createUser);

// Get user by ID
router.get("/getById/:id", getUserById);

// Update user by ID
router.put("/update/:id", upload, updateUser);

// Partially update user by ID
router.patch("/patch/:id", upload, patchUser);

// Delete user by ID
router.delete("/delete/:id", deleteUser);

module.exports = router;
