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
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send("Access Denied: Insufficient Permissions");
        }

        next();
    };
}

const protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // If no token is found, send unauthorized error
    if (!token) {
        return res.status(401).json({ message: "Not authorized to access this route" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by decoded id
        req.user = await User.findById(decoded.id);
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(401).json({ message: "Not authorized to access this route" });
    }
};

module.exports = { authenticateToken, authorizeRole, protect };
