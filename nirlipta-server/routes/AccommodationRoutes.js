const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Import multer middleware
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

// Ensure the multer middleware is used correctly before the controller
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
}, createAccommodation); // createAccommodation is the next middleware after upload

// Update accommodation by ID (PUT for full update)
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
}, updateAccommodation); // updateAccommodation is the next middleware after upload


// Get accommodation by ID
router.get("/getById/:id", getAccommodationById);



// Partially update accommodation by ID (PATCH)
router.patch("/patch/:id", patchAccommodation);

// Delete accommodation by ID
router.delete("/delete/:id", deleteAccommodation);

module.exports = router;
