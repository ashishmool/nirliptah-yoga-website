const express = require("express");
const router = express.Router();
const { upload } = require("../config/multerConfig");
const {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
} = require("../controller/WorkshopController");

// Get all workshops
router.get("/", getAllWorkshops);

// Create a new workshop with file uploads
router.post(
    "/save",
    upload,
    (req, res, next) => {
        if (req.files && req.files.workshop_photo) {
            console.log("Workshop photo uploaded:", req.files.workshop_photo);
        }
        next();
    },
    createWorkshop
);

// Get a workshop by ID
router.get("/:id", getWorkshopById);

// Update an existing workshop with file uploads
router.put(
    "/update/:id",
    upload,
    (req, res, next) => {
        if (req.files && req.files.workshop_photo) {
            console.log("Workshop photo uploaded:", req.files.workshop_photo);
        }
        next();
    },
    updateWorkshop
);

// Delete a workshop by ID
router.delete("/delete/:id", deleteWorkshop);

module.exports = router;
