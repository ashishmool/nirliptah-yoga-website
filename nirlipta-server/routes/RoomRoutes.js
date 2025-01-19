const express = require("express");
const router = express.Router();
const { upload } = require("../config/multerConfig");
const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
} = require("../controller/RoomController");

// Get all accommodation rooms
router.get("/", getAllRooms);

// Get accommodation room by ID
router.get("/:id", getRoomById);

// Create a new accommodation room
router.post("/save", upload, createRoom);

// Update accommodation room by ID
router.put("/update/:id", upload, updateRoom);

// Delete accommodation room by ID
router.delete("/delete/:id", deleteRoom);

module.exports = router;
