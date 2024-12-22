const WorkshopCategory = require("../models/WorkshopCategory");

// Get all workshop categories
const getWorkshopCategories = async (req, res) => {
    try {
        const categories = await WorkshopCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workshop categories", error });
    }
};

// Get workshop category by ID
const getWorkshopCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await WorkshopCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Workshop category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workshop category", error });
    }
};

// Create a new workshop category
const createWorkshopCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validate that the required fields are provided
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Create a new category document
        const newCategory = new WorkshopCategory({
            name,
            description,
        });

        // Save to the database
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Error creating category", error });
    }
};

// Update workshop category by ID (PUT)
const updateWorkshopCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Update category document
        const updatedCategory = await WorkshopCategory.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Workshop category not found" });
        }

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
};

// Partially update workshop category by ID (PATCH)
const patchWorkshopCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await WorkshopCategory.findByIdAndUpdate(id, req.body, { new: true, upsert: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Workshop category not found" });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Error partially updating category", error });
    }
};

// Delete workshop category by ID
const deleteWorkshopCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await WorkshopCategory.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Workshop category not found" });
        }
        res.json({ message: "Workshop category deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
};

module.exports = {
    getWorkshopCategories,
    getWorkshopCategoryById,
    createWorkshopCategory,
    updateWorkshopCategory,
    patchWorkshopCategory,
    deleteWorkshopCategory,
};
