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

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads"; // Default folder

        // Determine folder based on the field name
        switch (file.fieldname) {
            case "retreat_photo":
                folder = "retreat_photos";
                break;
            case "guests[0][photo]":
                folder = "guest_photos";
                break;
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
            default:
                folder = "misc";
        }

        const uploadPath = path.join(uploadDirectory, folder);
        createDirectoryIfNotExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname); // Extract file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true); // File is valid
    } else {
        cb(new Error("Unsupported file type! Only JPEG, JPG, and PNG are allowed."));
    }
};

// Multer upload configuration
const upload = multer({
    storage,
    fileFilter,
    // Uncomment and adjust the following line if file size limits are needed
    // limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
}).fields([
    { name: "retreat_photo", maxCount: 1 },
    { name: "guests[0][photo]", maxCount: 1 }, // First guest photo
    { name: "guests[1][photo]", maxCount: 1 }, // Second guest photo (if any)
    { name: "workshop_photo", maxCount: 1 }, // Workshop photo
    { name: "accommodation_photo", maxCount: 1 }, // Accommodation photo
    { name: "profile_picture", maxCount: 1 }, // Profile photo
    { name: "pose_photo", maxCount: 1 }, // Add pose photo field
]);


module.exports = upload;
