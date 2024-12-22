const Accommodation = require("../models/Accommodation");
const upload = require("../config/multerConfig"); // Import the multer configuration

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
    // Check if the accommodation photo is uploaded
    if (!req.files || !req.files.accommodation_photo || req.files.accommodation_photo.length === 0) {
        return res.status(400).json({ message: "Accommodation photo is required" });
    }

    try {
        const { name, description, price_per_night, location, max_occupancy, available_rooms, amenities } = req.body;

        // Validate that the required fields are provided
        if (!available_rooms || !price_per_night) {
            return res.status(400).json({ message: "Price and available rooms are required" });
        }

        // Assuming only one file is uploaded for accommodation photo
        const accommodationPhotoPath = `/uploads/accommodation_photos/${req.files.accommodation_photo[0].filename}`;

        // Create a new accommodation document
        const newAccommodation = new Accommodation({
            name,
            description,
            price_per_night,
            location,
            available_rooms,
            max_occupancy,
            amenities,
            photo: accommodationPhotoPath, // Store the relative path to the image
        });

        // Save to the database
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

        // If a new accommodation photo is uploaded, update the photo field with the new file path
        if (req.files && req.files.accommodation_photo && req.files.accommodation_photo.length > 0) {
            req.body.photo = `/uploads/accommodation_photos/${req.files.accommodation_photo[0].filename}`;  // Path to the uploaded photo
        }

        // Update accommodation document
        const updatedAccommodation = await Accommodation.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedAccommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
        }

        res.json(updatedAccommodation);
    } catch (error) {
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
        const deletedAccommodation = await Accommodation.findByIdAndDelete(id);
        if (!deletedAccommodation) {
            return res.status(404).json({ message: "Accommodation not found" });
        }
        res.json({ message: "Accommodation deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting accommodation", error });
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
