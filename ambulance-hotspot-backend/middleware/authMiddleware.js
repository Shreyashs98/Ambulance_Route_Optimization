// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is found, return an error
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded; // Attach the decoded token to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
