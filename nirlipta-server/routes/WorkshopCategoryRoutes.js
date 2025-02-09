const express = require("express");
const router = express.Router();
const {
    getWorkshopCategories,
    getWorkshopCategoryById,
    createWorkshopCategory,
    updateWorkshopCategory,
    deleteWorkshopCategory
} = require("../controller/WorkshopCategoryController");
const {protect, authorizeRole} = require("../security/Auth");
const {upload} = require("../config/multerConfig");

// Get all workshop categories
router.get("/", getWorkshopCategories);

// Get workshop category by ID
router.get("/:id", getWorkshopCategoryById);

// Create a new workshop category
router.post("/save",upload, createWorkshopCategory);

// Update workshop category by ID
router.put("/update/:id", upload, protect,authorizeRole("admin"), updateWorkshopCategory);

// Delete workshop category by ID
router.delete("/delete/:id", protect,authorizeRole("admin"), deleteWorkshopCategory);

module.exports = router;
