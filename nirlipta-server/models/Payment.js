const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "User",
            required: true,
        },
        retreat_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Retreat",
        },
        subscription_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "Subscription",
        },
        amount: {
            type: Number,
            required: true,
        },
        payment_date: {
            type: Date,
            default: Date.now,
        },
        payment_method: {
            type: String,
            enum: ["credit_card", "paypal", "bank_transfer"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
