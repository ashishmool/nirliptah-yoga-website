const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        subscription_id: {
            type: mongoose.Schema.Types.ObjectId, // Primary Key
            auto: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Foreign Key
            ref: "User",
            required: true,
        },
        plan: {
            type: String, // E.g., "monthly", "annual"
            required: true,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "expired", "canceled"],
            default: "active",
        },
    },
    { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
