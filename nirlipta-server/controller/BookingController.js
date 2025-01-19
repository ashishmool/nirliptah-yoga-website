const Booking = require("../models/Booking");
const Retreat = require("../models/Retreat");
const Room = require("../models/Room");

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { user_id, retreat_id, accommodation_id, quantity, selected_rooms } = req.body;

        // Fetch retreat details
        const retreat = await Retreat.findById(retreat_id);
        if (!retreat) {
            return res.status(404).json({ message: "Retreat not found" });
        }
        if (quantity > retreat.max_participants) {
            return res.status(400).json({ message: "Quantity exceeds max participants for the retreat." });
        }

        // Calculate retreat amount
        const retreat_amount = quantity * retreat.price_per_person;

        let accommodation_amount = 0;

        // Validate and calculate accommodation details (if applicable)
        if (accommodation_id && selected_rooms && selected_rooms.length > 0) {
            const roomPromises = selected_rooms.map(async (room) => {
                const roomDetails = await Room.findById(room.room_id);
                if (!roomDetails) {
                    throw new Error(`Room with ID ${room.room_id} not found.`);
                }
                if (room.quantity > roomDetails.quantity) {
                    throw new Error(`Selected quantity exceeds available rooms for ${roomDetails.room_type}.`);
                }
                accommodation_amount += room.quantity * roomDetails.price;
                return roomDetails;
            });

            // Wait for all room validations
            await Promise.all(roomPromises);
        }

        // Calculate total amount
        const total_amount = retreat_amount + accommodation_amount;

        // Create booking
        const newBooking = new Booking({
            user_id,
            retreat_id,
            accommodation_id,
            quantity,
            accommodation_amount,
            retreat_amount,
            total_amount,
            selected_rooms,
            status: "pending",
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Error creating booking", error: error.message });
    }
};

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user_id", "name email") // Populate user details
            .populate("retreat_id", "title start_date end_date") // Populate retreat details
            .populate("selected_rooms.room_id", "room_type price"); // Populate room details

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
};
