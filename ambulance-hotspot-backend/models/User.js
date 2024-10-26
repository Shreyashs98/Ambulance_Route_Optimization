// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hospitalName: {
        type: String,
        required: true,
    },
    hospitalId: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

module.exports = mongoose.model('User', userSchema);
