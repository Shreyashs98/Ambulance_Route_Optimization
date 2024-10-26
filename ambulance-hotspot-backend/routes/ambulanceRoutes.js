const express = require('express');
const router = express.Router();
const ambulanceController = require('../controllers/ambulanceController');

// Route to create a new ambulance
router.post('/', ambulanceController.createAmbulance);

// Route to get all ambulances
router.get('/', ambulanceController.getAllAmbulances);

module.exports = router;
