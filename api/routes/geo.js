const express = require('express');
const router = express.Router();
const { getWinesNearby, getWinesWithinBounds } = require('../controllers/geoController');

// @route   GET /api/geo/nearby
// @desc    Get wines within a certain radius
// @access  Public
router.get('/nearby', getWinesNearby);

// @route   GET /api/geo/within-bounds
// @desc    Get wines within a map's bounding box
// @access  Public
router.get('/within-bounds', getWinesWithinBounds);

module.exports = router;
