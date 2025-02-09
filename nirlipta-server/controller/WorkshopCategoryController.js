const WorkshopCategory = require("../models/WorkshopCategory");

// Get all workshop categories
const getWorkshopCategories = async (req, res) => {
    try {
        console.log("GET /api/categories");
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
    if (!req.files || !req.files.category_photo) {
        return res.status(400).json({ message: "Category photo is required" });
    }
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
            photo: `/uploads/category_photos/${req.files.category_photo[0].filename}`,
        });

        // Save to the database
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Error creating category", error });
    }
};
const updateWorkshopCategory = async (req, res) => {
    try {
        const { id } = req.params;


        // Find the existing category
        const category = await WorkshopCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Workshop category not found" });
        }

        console.log("Categories Update Debugging::: ",category);

        // Update category fields
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;



        // If a new photo is uploaded, update the photo field
        if (req.files && req.files.category_photo) {
            category.photo = `/uploads/category_photos/${req.files.category_photo[0].filename}`;
        }

        // Save the updated category
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
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
