const Accommodation = require("../models/Accommodation");
const Room = require("../models/Room");

// Get all accommodations
const getAccommodations = async (req, res) => {
    try {
        const accommodations = await Accommodation.find();
        res.json(accommodations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching accommodations", error });
    }
};

// Get accommodation by ID
const getAccommodationById = async (req, res) => {
    try {
        const { id } = req.params;
        const accommodation = await Accommodation.findById(id);
        if (!accommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
        }
        res.json(accommodation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching accommodation", error });
    }
};

// Create a new accommodation
const createAccommodation = async (req, res) => {
    if (!req.files || !req.files.accommodation_photo || req.files.accommodation_photo.length === 0) {
        return res.status(400).json({ message: "Accommodation photo is required" });
    }

    try {
        const { name, description, location, room_types, amenities } = req.body;

        const accommodationPhotoPath = `/uploads/accommodation_photos/${req.files.accommodation_photo[0].filename}`;

        const newAccommodation = new Accommodation({
            name,
            description,
            location,
            amenities,
            room_types,
            photo: accommodationPhotoPath, // Store the relative path to the image
        });

        const savedAccommodation = await newAccommodation.save();
        res.status(201).json(savedAccommodation);
    } catch (error) {
        console.error("Error creating accommodation:", error);
        res.status(500).json({ message: "Error creating accommodation", error });
    }
};

// Update accommodation by ID (PUT)
const updateAccommodation = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.files && req.files.accommodation_photo) {
            req.body.photo = `/uploads/accommodation_photos/${req.files.accommodation_photo[0].filename}`;
        }

        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedAccommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
        }

        res.json(updatedAccommodation);
    } catch (error) {
        console.error("Error updating accommodation:", error);
        res.status(500).json({ message: "Error updating accommodation", error });
    }
};


// Partially update accommodation by ID (PATCH)
const patchAccommodation = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, req.body, { new: true, upsert: true });
        if (!updatedAccommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
        }
        res.json(updatedAccommodation);
    } catch (error) {
        res.status(500).json({ message: "Error partially updating accommodation", error });
    }
};

// Delete accommodation by ID
const deleteAccommodation = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the accommodation by ID
        const accommodation = await Accommodation.findById(id);

        if (!accommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
        }

        // Find all rooms associated with the accommodation
        const rooms = await Room.find({ accommodation_id: id });

        // If rooms are found, delete each one
        if (rooms.length > 0) {
            // Loop through and delete each associated room
            for (const room of rooms) {
                await Room.findByIdAndDelete(room._id);
            }
        }

        // Now delete the accommodation itself
        await accommodation.deleteOne();

        res.json({ message: "Accommodation and associated rooms deleted successfully" });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).json({
            message: "Error deleting accommodation and rooms",
            error: error.message || error,
        });
    }
};


module.exports = {
    getAccommodations,
    getAccommodationById,
    createAccommodation,
    updateAccommodation,
    patchAccommodation,
    deleteAccommodation,
};
