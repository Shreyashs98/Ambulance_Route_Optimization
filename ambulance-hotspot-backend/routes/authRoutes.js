// routes/authRoutes.js

const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, (req, res) => {
    // Example profile route
    res.status(200).json({ message: 'Profile accessed', userId: req.user.id });
});

module.exports = router;
