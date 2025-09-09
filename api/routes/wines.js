const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createWine,
  getAllWines,
  updateWine,
  deleteWine
} = require('../controllers/wines/wineController');

// @route   POST api/wines
// @desc    Create a new wine
// @access  Private (Admin, Editor)
router.post('/', [auth, authorize('Admin', 'Editor')], createWine);

// @route   PUT api/wines/:id
// @desc    Update a wine
// @access  Private (Admin, Editor)
router.put('/:id', [auth, authorize('Admin', 'Editor')], updateWine);

// @route   DELETE api/wines/:id
// @desc    Delete a wine
// @access  Private (Admin, Editor)
router.delete('/:id', [auth, authorize('Admin', 'Editor')], deleteWine);

// @route   GET api/wines
// @desc    Get all wines
// @access  Public
router.get('/', getAllWines);

module.exports = router;
