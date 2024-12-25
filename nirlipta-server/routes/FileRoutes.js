const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig").upload;
const { uploadFile, multipleFile } = require("../controller/FileController");

// Route for single and multiple uploads using `.fields()`
router.post("/upload", (req, res, next) => {
    upload.fields([{ name: "file", maxCount: 1 }])(req, res, (err) => {
        if (err) return res.status(400).send({ error: err.message });
        next();
    });
}, uploadFile);

router.post("/uploads", (req, res, next) => {
    upload.fields([{ name: "files", maxCount: 10 }])(req, res, (err) => {
        if (err) return res.status(400).send({ error: err.message });
        next();
    });
}, multipleFile);

module.exports = router;
