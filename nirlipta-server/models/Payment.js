const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["workshop", "retreat", "accommodation", "booking"],
            required: true,
        },
        reference_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "type", // Dynamically refers to the related entity
        },
        amount: {
            type: Number,
            required: true,
        },
        payment_method: {
            type: String,
            enum: ["credit_card", "paypal", "bank_transfer", "cash"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        transaction_id: {
            type: String,
        },
        payment_date: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
