const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).send("Access denied: No token provided");
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified; // Attach the user data to the request object
        next();
    } catch (e) {
        res.status(400).send("Invalid token");
    }
}

// Middleware to authorize based on role
const authorizeRole = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized, no user found!" });
    }

    // Check if the user role matches the expected role
    if (req.user.role !== role) {
        return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }

    next(); // Move to the next middleware/route handler
};



const protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // If no token is found, send unauthorized error
    if (!token) {
        return res.status(401).json({ message: "No token found error" });
    }

    try {
        // Verify the token and log decoded data
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Decoded Token:", decoded); // Debugging log

        if (!decoded.user_id) {
            return res.status(400).json({ message: "Invalid token payload: No user_id" });
        }

        // Find the user by decoded user_id (NOT decoded.id)
        req.user = await User.findById(decoded.user_id);

        if (!req.user) {
            console.log("User not found in database for ID:", decoded.user_id);
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        // console.log("Authenticated User ID:", req.user.id);
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        console.error("Error in protect middleware:", err);
        return res.status(401).json({ message: "Not authorized to access this route!" });
    }
};



module.exports = { authenticateToken, authorizeRole, protect };
