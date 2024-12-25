const Retreat = require("../models/Retreat");
const upload = require("../config/multerConfig");

// Get all retreats
const getRetreats = async (req, res) => {
    try {
        const retreats = await Retreat.find().populate("accommodation_id instructor_id");
        res.json(retreats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching retreats", error });
    }
};

// Get a retreat by ID
const getRetreatById = async (req, res) => {
    try {
        const { id } = req.params;
        const retreat = await Retreat.findById(id).populate("accommodation_id instructor_id");
        if (!retreat) {
            return res.status(404).json({ message: "Retreat not found" });
        }
        res.json(retreat);
    } catch (error) {
        res.status(500).json({ message: "Error fetching retreat", error });
    }
};

// Create a new retreat
const createRetreat = async (req, res) => {
    // Check if the retreat photo is uploaded
    if (!req.files || !req.files.retreat_photo || req.files.retreat_photo.length === 0) {
        return res.status(400).json({ message: "Retreat photo is required" });
    }

    try {
        const {
            title,
            description,
            start_date,
            end_date,
            price_per_person,
            max_participants,
            address,
            map_location,
            meals_info,
            organizer,
            guests,
            featuring_events,
            accommodation_id,
            instructor_id,
        } = req.body;

        const retreatPhotoPath = `/uploads/retreat_photos/${req.files.retreat_photo[0].filename}`;

        const newRetreat = new Retreat({
            title,
            description,
            start_date,
            end_date,
            price_per_person,
            max_participants,
            address,
            map_location,
            meals_info,
            organizer,
            guests,
            featuring_events,
            accommodation_id,
            instructor_id,
            retreat_photo: retreatPhotoPath,
        });

        const savedRetreat = await newRetreat.save();
        res.status(201).json(savedRetreat);
    } catch (error) {
        console.error("Error creating retreat:", error);
        res.status(500).json({ message: "Error creating retreat", error });
    }
};

// Update a retreat by ID (PUT)
const updateRetreat = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.files && req.files.retreat_photo && req.files.retreat_photo.length > 0) {
            req.body.retreat_photo = `/uploads/retreat_photos/${req.files.retreat_photo[0].filename}`;
        }

        const updatedRetreat = await Retreat.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRetreat) {
            return res.status(404).json({ message: "Retreat not found" });
        }

        res.json(updatedRetreat);
    } catch (error) {
        res.status(500).json({ message: "Error updating retreat", error });
    }
};

// Partially update a retreat by ID (PATCH)
const patchRetreat = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedRetreat = await Retreat.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRetreat) {
            return res.status(404).json({ message: "Retreat not found" });
        }

        res.json(updatedRetreat);
    } catch (error) {
        res.status(500).json({ message: "Error partially updating retreat", error });
    }
};

// Delete a retreat by ID
const deleteRetreat = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRetreat = await Retreat.findByIdAndDelete(id);

        if (!deletedRetreat) {
            return res.status(404).json({ message: "Retreat not found" });
        }

        res.json({ message: "Retreat deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting retreat", error });
    }
};

module.exports = {
    getRetreats,
    getRetreatById,
    createRetreat,
    updateRetreat,
    patchRetreat,
    deleteRetreat,
};
