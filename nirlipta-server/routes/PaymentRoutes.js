const express = require("express");
const router = express.Router();
const {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
} = require("../controller/PaymentController");

// Get all payments
router.get("/", getAllPayments);

// Get payment by ID
router.get("/:id", getPaymentById);

// Create a new payment
router.post("/save", createPayment);

// Update payment by ID
router.put("/update/:id", updatePayment);

// Delete payment by ID
router.delete("/delete/:id", deletePayment);

module.exports = router;
