const Room = require("../models/Room");

// Get all accommodation rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching accommodation rooms", error });
    }
};

// Get accommodation room by ID
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: "Accommodation room not found" });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: "Error fetching accommodation room by ID", error });
    }
};

// Create a new accommodation room
const createRoom = async (req, res) => {
    if (!req.files || !req.files.room_photo) {
        return res.status(400).json({ message: "Room photo is required" });
    }

    try {
        const { room_type, max_occupancy, price, quantity, accommodation_id } = req.body;

        const newRoom = new Room({
            room_type,
            max_occupancy,
            price,
            accommodation_id,
            quantity,
            photo: `/uploads/room_photos/${req.files.room_photo[0].filename}`,
        });

        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(500).json({ message: "Error creating accommodation room", error });
    }
};

// Update accommodation room by ID
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;

        // Handle photo update
        if (req.files && req.files.room_photo) {
            req.body.photo = `/uploads/room_photos/${req.files.room_photo[0].filename}`;
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: "Accommodation room not found" });
        }

        res.json(updatedRoom);
    } catch (error) {
        res.status(500).json({ message: "Error updating accommodation room", error });
    }
};

// Delete accommodation room by ID
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Accommodation room not found" });
        }
        res.json({ message: "Accommodation room deleted successfully", deletedRoom });
    } catch (error) {
        res.status(500).json({ message: "Error deleting accommodation room", error });
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
};
