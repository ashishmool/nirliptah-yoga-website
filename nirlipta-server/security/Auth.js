const jwt = require("jsonwebtoken");
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

module.exports = { authenticateToken, authorizeRole };
