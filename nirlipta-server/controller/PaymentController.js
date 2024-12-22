const Payment = require("../models/Payment");

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate("user_id retreat_id subscription_id");
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id).populate("user_id retreat_id subscription_id");
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payment by ID", error });
    }
};

// Create a new payment
const createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json({ message: "Payment created successfully", payment });
    } catch (error) {
        res.status(500).json({ message: "Error creating payment", error });
    }
};

// Update payment by ID (PUT)
const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json({ message: "Payment updated successfully", updatedPayment });
    } catch (error) {
        res.status(500).json({ message: "Error updating payment", error });
    }
};

// Delete payment by ID
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByIdAndDelete(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json({ message: "Payment deleted successfully", deletedPayment });
    } catch (error) {
        res.status(500).json({ message: "Error deleting payment", error });
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
};
