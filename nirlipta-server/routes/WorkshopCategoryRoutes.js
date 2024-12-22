const express = require("express");
const router = express.Router();
const {
    getWorkshopCategories,
    getWorkshopCategoryById,
    createWorkshopCategory,
    updateWorkshopCategory,
    deleteWorkshopCategory
} = require("../controller/WorkshopCategoryController");

// Get all workshop categories
router.get("/", getWorkshopCategories);

// Get workshop category by ID
router.get("/:id", getWorkshopCategoryById);

// Create a new workshop category
router.post("/save", createWorkshopCategory);

// Update workshop category by ID
router.put("/update/:id", updateWorkshopCategory);

// Delete workshop category by ID
router.delete("/delete/:id", deleteWorkshopCategory);

module.exports = router;
