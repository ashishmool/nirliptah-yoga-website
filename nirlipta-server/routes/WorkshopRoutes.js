const express = require("express");
const router = express.Router();
const { upload } = require("../config/multerConfig");
const {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
} = require("../controller/WorkshopController");

router.get("/", getAllWorkshops);
router.get("/:id", getWorkshopById);
router.post("/save", upload, createWorkshop);
router.put("/update/:id", upload, updateWorkshop);
router.delete("/delete/:id", deleteWorkshop);

module.exports = router;
