const express = require("express");
const router = express.Router();
const { upload } = require("../config/multerConfig"); // Import multer middleware
const {
    getAccommodations,
    getAccommodationById,
    createAccommodation,
    updateAccommodation,
    patchAccommodation,
    deleteAccommodation,
} = require("../controller/AccommodationController");

// Get all accommodations
router.get("/", getAccommodations);

// Get accommodation by ID
router.get("/:id", getAccommodationById);

router.post("/save", upload, createAccommodation);

router.put("/update/:id", upload, updateAccommodation);

// Partially update accommodation by ID (PATCH)
router.patch("/patch/:id", patchAccommodation);

// Delete accommodation by ID
router.delete("/delete/:id", deleteAccommodation);

module.exports = router;
