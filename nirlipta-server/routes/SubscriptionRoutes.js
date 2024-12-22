const { getAllSubscriptions, getSubscriptionById, createSubscription, updateSubscription, deleteSubscription } = require("../controller/SubscriptionController");
const express = require("express");
const router = express.Router();

// Get all subscriptions
router.get("/", getAllSubscriptions);

// Get subscription by ID
router.get("/:id", getSubscriptionById);

// Create a new subscription
router.post("/save", createSubscription);

// Update subscription by ID
router.put("/update/:id", updateSubscription);

// Delete subscription by ID
router.delete("/delete/:id", deleteSubscription);

module.exports = router;
