const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Import multer middleware
const {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
} = require("../controller/WorkshopController");

// Get all workshops
router.get("/", getAllWorkshops);

// Create a new workshop
router.post(
    "/save",
    (req, res, next) => {
        upload(req, res, function (err) {
            if (err) {
                console.error("Multer Error:", err.message);
                return res.status(400).json({ message: err.message });
            }
            next(); // Proceed to the next middleware if upload succeeds
        });
    },
    createWorkshop
);

// Get a workshop by ID
router.get("/:id", getWorkshopById);

// Update workshop by ID
router.put(
    "/update/:id",
    (req, res, next) => {
        upload(req, res, function (err) {
            if (err) {
                console.error("Multer Error:", err.message);
                return res.status(400).json({ message: err.message });
            }
            next(); // Proceed to the next middleware if upload succeeds
        });
    },
    updateWorkshop
);

// Delete workshop by ID
router.delete("/delete/:id", deleteWorkshop);

module.exports = router;
