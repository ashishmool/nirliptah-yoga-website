const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/multerConfig");
const {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
} = require("../controller/WorkshopController");
const {protect} = require("../security/Auth");

router.get("/", getAllWorkshops);
router.get("/:id", getWorkshopById);
router.post("/save", upload, createWorkshop);
router.put("/update/:id",protect, upload, updateWorkshop);
router.delete("/delete/:id", protect, deleteWorkshop);

module.exports = router;
