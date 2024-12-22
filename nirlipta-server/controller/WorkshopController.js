const Workshop = require("../models/Workshop");
const Category = require("../models/WorkshopCategory");
const Instructor = require("../models/Instructor");

// Get all workshops
const getAllWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find()
            .populate("instructor_id")
            .populate("category");
        res.json(workshops);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workshops", error });
    }
};

// Get workshop by ID
const getWorkshopById = async (req, res) => {
    try {
        const { id } = req.params;
        const workshop = await Workshop.findById(id)
            .populate("instructor_id")
            .populate("category");
        if (!workshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }
        res.json(workshop);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workshop by ID", error });
    }
};

// Create a new workshop
const createWorkshop = async (req, res) => {
    if (!req.files || !req.files.workshop_photo) {
        return res.status(400).json({ message: "Workshop photo is required" });
    }

    try {
        const {
            title,
            description,
            difficulty_level,
            price,
            discount_price,
            classroom_info,
            address,
            map_location,
            instructor_id,
            category,
            newCategory,
            modules,
        } = req.body;

        // Parse and validate modules as before
        let parsedModules = [];
        if (typeof modules === "string") {
            parsedModules = JSON.parse(modules);
        } else if (Array.isArray(modules)) {
            parsedModules = modules;
        }

        // Handle category creation if needed
        let selectedCategory = category;
        if (category === "create-new" && newCategory) {
            const existingCategory = await Category.findOne({ name: newCategory });
            if (existingCategory) {
                return res.status(400).json({ message: "Category already exists" });
            }
            const newCategoryDoc = new Category({ name: newCategory });
            await newCategoryDoc.save();
            selectedCategory = newCategoryDoc._id;
        }

        // Create new workshop
        const newWorkshop = new Workshop({
            title,
            description,
            difficulty_level,
            price,
            discount_price,
            classroom_info,
            address,
            map_location,
            instructor_id,
            category: selectedCategory,
            modules: parsedModules,
            photo: `/uploads/workshop_photos/${req.files.workshop_photo[0].filename}`, // Correctly reference the uploaded workshop photo
        });

        const savedWorkshop = await newWorkshop.save();
        res.status(201).json(savedWorkshop);
    } catch (error) {
        console.error("Error creating workshop:", error);
        res.status(500).json({ message: "Error creating workshop", error });
    }
};


// Update workshop by ID
const updateWorkshop = async (req, res) => {
    try {
        const { id } = req.params;
        let { category, newCategory, modules } = req.body;

        // Parse and validate modules as before
        let parsedModules = [];
        if (typeof modules === "string") {
            parsedModules = JSON.parse(modules);
        } else if (Array.isArray(modules)) {
            parsedModules = modules;
        }

        // Handle category creation if needed
        if (category === "create-new" && newCategory) {
            const existingCategory = await Category.findOne({ name: newCategory });
            if (existingCategory) {
                return res.status(400).json({ message: "Category already exists" });
            }
            const newCategoryDoc = new Category({ name: newCategory });
            await newCategoryDoc.save();
            category = newCategoryDoc._id;
        }

        // Handle photo upload if new photo is provided
        if (req.files && req.files.workshop_photo) {
            req.body.photo = `/uploads/workshop_photos/${req.files.workshop_photo[0].filename}`;
        }

        // Update workshop data
        const updatedWorkshopData = {
            ...req.body,
            modules: parsedModules, // Update modules
            category, // Update category
        };

        const updatedWorkshop = await Workshop.findByIdAndUpdate(id, updatedWorkshopData, {
            new: true,
            runValidators: true,
        });

        if (!updatedWorkshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }

        res.json(updatedWorkshop);
    } catch (error) {
        console.error("Error updating workshop:", error);
        res.status(500).json({ message: "Error updating workshop", error });
    }
};

// Delete workshop by ID
const deleteWorkshop = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWorkshop = await Workshop.findByIdAndDelete(id);
        if (!deletedWorkshop) {
            return res.status(404).json({ message: "Workshop not found" });
        }
        res.json({ message: "Workshop deleted successfully", deletedWorkshop });
    } catch (error) {
        res.status(500).json({ message: "Error deleting workshop", error });
    }
};

module.exports = {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
};
