// controllers/authController.js

const User = require('../models/User'); // User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Register a new user
exports.register = async (req, res) => {
    const { email, hospitalName, hospitalId, location, number, password } = req.body;
    console.log(req.body)
    // Check for missing fields
    if (!email || !hospitalName || !hospitalId || !location || !number || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            hospitalName,
            hospitalId,
            location,
            number,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { hospitalId, password } = req.body;
    console.log(req.body)
    // Check for missing fields
    if (!hospitalId || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ hospitalId });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION || '1h' }); // Optional expiration time
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
