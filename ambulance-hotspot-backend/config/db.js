// config/db.js

const mongoose = require('mongoose');
const config = require('./config'); // Import configuration settings

const connectDB = async () => {
    try {
        await mongoose.connect(config.DB_URI);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
