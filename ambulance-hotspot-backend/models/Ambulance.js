// models/Ambulance.js

const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
    numberPlate: {
        type: String,
        required: true,
        unique: true,
    },
    available: {
        type: Boolean,
        default: true, // True if the ambulance is available for assignments
    },
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
}, {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Create a 2dsphere index for geospatial queries
ambulanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
