const File = require("../models/File");

// Single PDF File Upload
const uploadFile = async (req, res) => {
    try {
        // Check if the uploaded file is present and is a PDF
        if (!req.file || req.file.mimetype !== "application/pdf") {
            return res.status(400).json({ error: "Only PDF files are allowed for this field." });
        }

        // Save file metadata to the database
        const file = new File({ file: req.file.filename });
        await file.save();

        res.status(200).json({ message: "PDF file uploaded successfully.", file: req.file });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload file.", details: error.message });
    }
};

// Multiple PDF Files Upload
const multipleFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded." });
        }

        // Filter and validate only PDF files
        const validFiles = req.files.filter(file => file.mimetype === "application/pdf");

        if (validFiles.length === 0) {
            return res.status(400).json({ error: "Only PDF files are allowed for this field." });
        }

        // Save each file's metadata to the database
        const savePromises = validFiles.map(file => {
            const newFile = new File({ file: file.filename });
            return newFile.save();
        });

        await Promise.all(savePromises);

        res.status(200).json({ message: "PDF files uploaded successfully.", files: validFiles });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload files.", details: error.message });
    }
};

module.exports = {
    uploadFile,
    multipleFile,
};
