const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createWine, getAllWines } = require('../controllers/wines/wineController');

// @route   POST api/wines
// @desc    Create a new wine
// @access  Private
router.post('/', auth, createWine);

// @route   GET api/wines
// @desc    Get all wines
// @access  Public
router.get('/', getAllWines);

module.exports = router;
