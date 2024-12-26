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

// Folder mapping for field names
const folderMapping = {
    "retreat_photo": "retreat_photos",
    "guests[0][photo]": "guest_photos",
    "guests[1][photo]": "guest_photos",
    "workshop_photo": "workshop_photos",
    "accommodation_photo": "accommodation_photos",
    "user_photo": "user_photos",
    "pose_photo": "pose_photos",
    "file": "pdf_files",
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = folderMapping[file.fieldname] || "misc";
        const uploadPath = path.join(uploadDirectory, folder);
        createDirectoryIfNotExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = {
        "retreat_photo": /image\/(jpeg|jpg|png)/,
        "workshop_photo": /image\/(jpeg|jpg|png)/,
        "accommodation_photo": /image\/(jpeg|jpg|png)/,
        "user_photo": /image\/(jpeg|jpg|png)/,
        "pose_photo": /image\/(jpeg|jpg|png)/,
        "file": /application\/pdf/,
        "files": /(application\/pdf|image\/(jpeg|jpg|png))/,
    };

    const allowedMimeType = allowedMimeTypes[file.fieldname];
    if (allowedMimeType && allowedMimeType.test(file.mimetype)) {
        cb(null, true); // Valid file
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}`));
    }
};

// Multer configurations
const upload = multer({ storage, fileFilter }).fields([
    { name: "retreat_photo", maxCount: 1 },
    { name: "workshop_photo", maxCount: 1 },
    { name: "accommodation_photo", maxCount: 1 },
    { name: "user_photo", maxCount: 1 },
    { name: "pose_photo", maxCount: 1 },
    { name: "file", maxCount: 1 },
]);

const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("file");

const uploadArray = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
}).array("files", 10); // Up to 10 files

module.exports = { upload, uploadSingle, uploadArray };
