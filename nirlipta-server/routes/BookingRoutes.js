const express = require("express");
const router = express.Router();
const { createBooking, getAllBookings } = require("../controller/BookingController");

// Create a booking
router.post("/save", createBooking);

// Get all bookings
router.get("/", getAllBookings);

module.exports = router;
