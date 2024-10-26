// routes/accidentRoutes.js

const express = require('express');
const { reportAccident, getAllAccidents } = require('../controllers/accidentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating a new accident report
router.post('/', reportAccident);

// Route for retrieving all accident reports
router.get('/', getAllAccidents);

module.exports = router;
