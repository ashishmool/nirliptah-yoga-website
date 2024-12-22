const Retreat = require("../models/Retreat"); // Assuming Retreat model is in models folder

const createRetreat = (req, res) => {
    const retreatData = req.body;

    // Handle uploaded photos (if any)
    let filePaths = [];
    if (req.files && req.files["retreat_photos"]) {
        filePaths = req.files["retreat_photos"].map(file => file.path); // Store the file paths
    }

    // Add file paths to the retreat data
    retreatData.photos = filePaths;

    // Save the retreat document to the database
    Retreat.create(retreatData)
        .then(retreat => res.status(201).json(retreat))
        .catch(err => res.status(500).json({ error: err.message }));
};


// Update retreat by ID (with image upload)
const updateRetreat = (req, res) => {
    const retreatId = req.params.id;
    const updateData = req.body;

    // Handle uploaded photos (if any)
    let updatedPhotos = [];
    if (req.files && req.files["retreat_photos"]) {
        updatedPhotos = req.files["retreat_photos"].map(file => file.path); // Update the photos field
        updateData.photos = updatedPhotos;
    }

    // Update retreat document in the database
    Retreat.findByIdAndUpdate(retreatId, updateData, { new: true })
        .then(updatedRetreat => res.status(200).json(updatedRetreat))
        .catch(err => res.status(500).json({ error: err.message }));
};

// Get all retreats
const getAllRetreats = (req, res) => {
    Retreat.find()
        .then(retreats => res.status(200).json(retreats))
        .catch(err => res.status(500).json({ error: err.message }));
};

// Get retreat by ID
const getRetreatById = (req, res) => {
    const retreatId = req.params.id;

    Retreat.findById(retreatId)
        .then(retreat => {
            if (!retreat) {
                return res.status(404).json({ message: "Retreat not found" });
            }
            res.status(200).json(retreat);
        })
        .catch(err => res.status(500).json({ error: err.message }));
};

// Delete retreat by ID
const deleteRetreat = (req, res) => {
    const retreatId = req.params.id;

    Retreat.findByIdAndDelete(retreatId)
        .then(deletedRetreat => {
            if (!deletedRetreat) {
                return res.status(404).json({ message: "Retreat not found" });
            }
            res.status(200).json({ message: "Retreat deleted successfully" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
};

module.exports = {
    createRetreat,
    updateRetreat,
    getAllRetreats,
    getRetreatById,
    deleteRetreat,
};
