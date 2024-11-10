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

// CORS middleware to handle multiple origins
const allowedOrigins = [
  'http://localhost:3000',         // Local development
  'https://ambulance108.vercel.app' // Production URL
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // If you need to send cookies or authentication headers
}));

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
  console.log(config.PORT);
});

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
