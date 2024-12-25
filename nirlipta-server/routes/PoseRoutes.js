const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Import multer middleware
const {
    getPoses,
    getPoseById,
    createPose,
    updatePose,
    patchPose,
    deletePose,
} = require("../controller/PoseController"); // Import PoseController functions

// Get all poses
router.get("/", getPoses);

// Ensure the multer middleware is used correctly before the controller
router.post("/save", (req, res, next) => {
    // Use multer middleware to handle file upload
    upload(req, res, function (err) {
        if (err) {
            // Handle multer errors here
            console.error("Multer Error:", err.message);
            return res.status(400).json({ message: err.message });
        }
        next(); // Proceed to the next middleware if upload succeeds
    });
}, createPose); // createPose is the next middleware after upload

// Update pose by ID (PUT for full update)
router.put("/update/:id", (req, res, next) => {
    // Use multer middleware to handle file upload
    upload(req, res, function (err) {
        if (err) {
            // Handle multer errors here
            console.error("Multer Error:", err.message);
            return res.status(400).json({ message: err.message });
        }
        next(); // Proceed to the next middleware if upload succeeds
    });
}, updatePose); // updatePose is the next middleware after upload

// Get pose by ID
router.get("/getById/:id", getPoseById);

// Partially update pose by ID (PATCH)
router.patch("/patch/:id", patchPose);

// Delete pose by ID
router.delete("/delete/:id", deletePose);

module.exports = router;
