// controllers/ambulanceController.js

const Ambulance = require('../models/Ambulance'); // Ambulance model

// Create a new ambulance
exports.createAmbulance = async (req, res) => {
    try {
        const ambulance = new Ambulance(req.body);
        await ambulance.save();
        res.status(201).json({ message: 'Ambulance created successfully', ambulance });
    } catch (error) {
        res.status(500).json({ message: 'Error creating ambulance', error });
    }
};

// Get all ambulances
exports.getAllAmbulances = async (req, res) => {
    try {
        const ambulances = await Ambulance.find();
        res.status(200).json(ambulances);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update ambulance status
exports.updateAmbulanceStatus = async (req, res) => {
    const { id } = req.params; // Get ambulance ID from request params
    const { status } = req.body; // Get new status from request body

    try {
        const updatedAmbulance = await Ambulance.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedAmbulance) {
            return res.status(404).json({ message: 'Ambulance not found' });
        }
        res.status(200).json(updatedAmbulance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};





