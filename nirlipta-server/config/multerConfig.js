const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the root and upload directories
const rootDir = path.resolve(__dirname, "../");
const uploadDirectory = path.join(rootDir, "uploads");

// Helper function to create directories if they don't exist
const createDirectoryIfNotExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Ensure the base upload directory exists
createDirectoryIfNotExists(uploadDirectory);

// Allowed MIME types for specific fields
const allowedMimeTypes = {
    "retreat_photo": /image\/(jpeg|jpg|png)/,
    "guests[0][photo]": /image\/(jpeg|jpg|png)/,
    "guests[1][photo]": /image\/(jpeg|jpg|png)/,
    "workshop_photo": /image\/(jpeg|jpg|png)/,
    "accommodation_photo": /image\/(jpeg|jpg|png)/,
    "profile_picture": /image\/(jpeg|jpg|png)/,
    "pose_photo": /image\/(jpeg|jpg|png)/,
    "file": /application\/pdf/, // Single PDF upload
    "files": /(application\/pdf|image\/(jpeg|jpg|png))/, // Multiple PDFs and images
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "misc"; // Default folder

        // Determine folder based on the field name
        switch (file.fieldname) {
            case "retreat_photo":
                folder = "retreat_photos";
                break;
            case "guests[0][photo]":
            case "guests[1][photo]":
                folder = "guest_photos";
                break;
            case "workshop_photo":
                folder = "workshop_photos";
                break;
            case "accommodation_photo":
                folder = "accommodation_photos";
                break;
            case "profile_picture":
                folder = "profile_pictures";
                break;
            case "pose_photo":
                folder = "pose_photos";
                break;
            case "file":
                folder = "pdf_files";
                break;
        }

        const uploadPath = path.join(uploadDirectory, folder);
        createDirectoryIfNotExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname).toLowerCase(); // Extract file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedMimeType = allowedMimeTypes[file.fieldname];

    console.log('File fieldname:', file.fieldname);
    console.log('File MIME type:', file.mimetype);

    if (!allowedMimeType) {
        return cb(new Error(`Unsupported field: ${file.fieldname}`));
    }

    if (allowedMimeType.test(file.mimetype)) {
        cb(null, true); // File is valid
    } else {
        cb(new Error(`Unsupported file type for ${file.fieldname}.`));
    }
};



// Create Multer configurations for various upload scenarios
const upload = multer({
    storage,
    fileFilter,
}).fields([
    { name: "retreat_photo", maxCount: 1 },
    { name: "guests[0][photo]", maxCount: 1 },
    { name: "guests[1][photo]", maxCount: 1 },
    { name: "workshop_photo", maxCount: 1 },
    { name: "accommodation_photo", maxCount: 1 },
    { name: "profile_picture", maxCount: 1 },
    { name: "pose_photo", maxCount: 1 },
    { name: "file", maxCount: 1 }, // Single PDF upload
]);

const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("file"); // For single file uploads

const uploadArray = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
}).array("files", 10); // Allows up to 10 files (PDFs or images)

// Export configurations
module.exports = { upload, uploadSingle, uploadArray };
