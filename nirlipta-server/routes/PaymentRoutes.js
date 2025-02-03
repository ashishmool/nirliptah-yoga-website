const express = require("express");
const router = express.Router();
const {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
} = require("../controller/PaymentController");
const {protect, authorizeRole} = require("../security/Auth");

// Get all payments
router.get("/",protect, authorizeRole("admin"), getAllPayments);

// Get payment by ID
router.get("/:id", getPaymentById);

// Create a new payment
router.post("/save", createPayment);

// Update payment by ID
router.put("/update/:id", protect, authorizeRole("admin"),updatePayment);

// Delete payment by ID
router.delete("/delete/:id", protect, authorizeRole("admin"), deletePayment);

module.exports = router;
