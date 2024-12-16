// config/config.js

require('dotenv').config(); // Load environment variables from .env file

const config = {
    PORT: process.env.PORT || 5001, // Default port to 5001 if not specified
    DB_URI: process.env.DB_URI || 'mongodb+srv://s09082003:hsshreyas00@cluster0.umllk4h.mongodb.net/ambulance-hotspot', // MongoDB URI
    JWT_SECRET: process.env.JWT_SECRET || 'AMBULANCE', // Secret key for JWT
};

module.exports = config;
