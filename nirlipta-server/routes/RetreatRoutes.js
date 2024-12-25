const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
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

// Get a retreat by ID
router.get("/:id", getRetreatById);

// Create a new retreat
router.post(
    "/save",
    (req, res, next) => {
        upload(req, res, function (err) {
            if (err) {
                console.error("Multer Error:", err.message);
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    },
    createRetreat
);

// Update a retreat by ID (PUT)
router.put(
    "/update/:id",
    (req, res, next) => {
        upload(req, res, function (err) {
            if (err) {
                console.error("Multer Error:", err.message);
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    },
    updateRetreat
);

// Partially update a retreat by ID (PATCH)
router.patch("/:id", patchRetreat);

// Delete a retreat by ID
router.delete("/:id", deleteRetreat);

module.exports = router;
