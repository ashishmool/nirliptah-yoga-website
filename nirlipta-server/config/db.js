const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/nirlipta_yoga_db";
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connection established successfully!");
    } catch (e) {
        console.error("Database connection error:", e);
        process.exit(1);
    }
};

module.exports = connectDB;