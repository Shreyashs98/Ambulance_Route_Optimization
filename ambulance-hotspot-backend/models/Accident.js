// models/Accident.js

const mongoose = require('mongoose');

const accidentSchema = new mongoose.Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    description: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'resolved'],
        default: 'pending',
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Create a 2dsphere index for geospatial queries
accidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Accident', accidentSchema);
