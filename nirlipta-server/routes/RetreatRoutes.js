const express = require("express");
const router = express.Router();
const { upload } = require("../config/multerConfig"); // Import multer middleware
const {
    getRetreats,
    getRetreatById,
    createRetreat,
    updateRetreat,
    patchRetreat,
    deleteRetreat,
} = require("../controller/RetreatController");

// Get all retreats
router.get("/", getRetreats);

// Get retreat by ID
router.get("/:id", getRetreatById);

// Create a new retreat
router.post("/save", upload, createRetreat);

// Update a retreat by ID (PUT)
router.put("/update/:id", upload, updateRetreat);

// Partially update a retreat by ID (PATCH)
router.patch("/patch/:id", patchRetreat);

// Delete a retreat by ID
router.delete("/delete/:id", deleteRetreat);

module.exports = router;
