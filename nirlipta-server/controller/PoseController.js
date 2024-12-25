const Pose = require("../models/Pose"); // Import the Pose model
const upload = require("../config/multerConfig"); // Import the multer configuration

// Get all poses
const getPoses = async (req, res) => {
    try {
        const poses = await Pose.find();
        res.json(poses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching poses", error });
    }
};

// Get pose by ID
const getPoseById = async (req, res) => {
    try {
        const { id } = req.params;
        const pose = await Pose.findById(id);
        if (!pose) {
            return res.status(404).json({ message: "Pose not found" });
        }
        res.json(pose);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pose", error });
    }
};

// Create a new pose
const createPose = async (req, res) => {
    // Check if the pose photo is uploaded
    if (!req.files || !req.files.pose_photo || req.files.pose_photo.length === 0) {
        return res.status(400).json({ message: "Pose photo is required" });
    }

    try {
        const { name, description, type } = req.body;

        // Validate that the required fields are provided
        if (!name || !description || !type) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        // Assuming only one file is uploaded for pose photo
        const posePhotoPath = `/uploads/pose_photos/${req.files.pose_photo[0].filename}`;

        // Create a new pose document
        const newPose = new Pose({
            name,
            type,
            description,
            photo: posePhotoPath, // Store the relative path to the image
        });

        // Save to the database
        const savedPose = await newPose.save();
        res.status(201).json(savedPose);
    } catch (error) {
        console.error("Error creating pose:", error);
        res.status(500).json({ message: "Error creating pose", error });
    }
};

// Update pose by ID (PUT)
const updatePose = async (req, res) => {
    try {
        const { id } = req.params;

        // If a new pose photo is uploaded, update the photo field with the new file path
        if (req.files && req.files.pose_photo && req.files.pose_photo.length > 0) {
            req.body.photo = `/uploads/pose_photos/${req.files.pose_photo[0].filename}`;  // Path to the uploaded photo
        }

        // Update pose document
        const updatedPose = await Pose.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPose) {
            return res.status(404).json({ message: "Pose not found" });
        }

        res.json(updatedPose);
    } catch (error) {
        res.status(500).json({ message: "Error updating pose", error });
    }
};

// Partially update pose by ID (PATCH)
const patchPose = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPose = await Pose.findByIdAndUpdate(id, req.body, { new: true, upsert: true });
        if (!updatedPose) {
            return res.status(404).json({ message: "Pose not found" });
        }
        res.json(updatedPose);
    } catch (error) {
        res.status(500).json({ message: "Error partially updating pose", error });
    }
};

// Delete pose by ID
const deletePose = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPose = await Pose.findByIdAndDelete(id);
        if (!deletedPose) {
            return res.status(404).json({ message: "Pose not found" });
        }
        res.json({ message: "Pose deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting pose", error });
    }
};

module.exports = {
    getPoses,
    getPoseById,
    createPose,
    updatePose,
    patchPose,
    deletePose,
};
