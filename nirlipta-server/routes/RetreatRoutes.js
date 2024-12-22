const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Import multer setup

const { getAllRetreats, getRetreatById, createRetreat, updateRetreat, deleteRetreat } = require("../controller/RetreatController");

router.post("/save", upload, (req, res) => {
    try {
        // Access files from req.files
        console.log("Uploaded files:", req.files);

        // Access other form data from req.body
        console.log("Form data:", req.body);

        // Call your controller with the data
        createRetreat(req, res);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post("/update/:id", upload, (req, res) => {
    try {
        // Access files from req.files
        console.log("Uploaded files:", req.files);

        // Access other form data from req.body
        console.log("Form data:", req.body);

        // Call your controller with the data
        updateRetreat(req, res);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get all retreats
router.get("/", getAllRetreats);

// Get retreat by ID
router.get("/:id", getRetreatById);

// Delete retreat by ID
router.delete("/delete/:id", deleteRetreat);

module.exports = router;
