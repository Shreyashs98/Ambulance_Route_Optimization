// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connectDB function
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const ambulanceRoutes = require('./routes/ambulanceRoutes');
const accidentRoutes = require('./routes/accidentRoutes');

// Initialize the Express application
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Update this to your React app's URL
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // If you need to send cookies or authentication headers
}));
 // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/ambulance', ambulanceRoutes); // Ambulance management routes
app.use('/api/accident', accidentRoutes); // Accident management routes

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});


// const express = require('express');
// const config = require('./config/config');
// const db = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const ambulanceRoutes = require('./routes/ambulanceRoutes');
// const accidentRoutes = require('./routes/accidentRoutes');

// const app = express();

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/ambulance', ambulanceRoutes);
// app.use('/api/accident', accidentRoutes);

// // Start the server
// const server = app.listen(config.PORT, () => {
//     console.log(`Server is running on port ${config.PORT}`);
// });

// // Export the app for testing
// module.exports = { app, server };
