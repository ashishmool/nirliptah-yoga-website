const Subscription = require("../models/Subscription");

// Get all subscriptions
const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate("user_id");
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subscriptions", error });
    }
};

// Get subscription by ID
const getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id).populate("user_id");
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subscription by ID", error });
    }
};

// Create a new subscription
const createSubscription = async (req, res) => {
    try {
        const subscription = new Subscription(req.body);
        await subscription.save();
        res.status(201).json({ message: "Subscription created successfully", subscription });
    } catch (error) {
        res.status(500).json({ message: "Error creating subscription", error });
    }
};

// Update subscription by ID (PUT)
const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSubscription = await Subscription.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedSubscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        res.json({ message: "Subscription updated successfully", updatedSubscription });
    } catch (error) {
        res.status(500).json({ message: "Error updating subscription", error });
    }
};

// Delete subscription by ID
const deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubscription = await Subscription.findByIdAndDelete(id);
        if (!deletedSubscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        res.json({ message: "Subscription deleted successfully", deletedSubscription });
    } catch (error) {
        res.status(500).json({ message: "Error deleting subscription", error });
    }
};

module.exports = {
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
};
