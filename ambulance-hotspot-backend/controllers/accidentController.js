// controllers/accidentController.js

const Accident = require('../models/Accident'); // Accident model

// Report a new accident
exports.reportAccident = async (req, res) => {
    const { location, description, severity } = req.body;

    try {
        const newAccident = new Accident({ location, description, severity });
        await newAccident.save();
        res.status(201).json({ message: 'Accident reported successfully', accident: newAccident });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all accidents
exports.getAllAccidents = async (req, res) => {
    try {
        const accidents = await Accident.find();
        res.status(200).json(accidents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
