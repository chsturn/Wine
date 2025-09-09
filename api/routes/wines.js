const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createWine,
  getAllWines,
  getWineById,
  updateWine,
  deleteWine
} = require('../controllers/wines/wineController');

// @desc    Get all wines
// @access  Public
router.get('/', getAllWines);

// @desc    Get a single wine by ID
// @access  Public
router.get('/:id', getWineById);

// @desc    Create a new wine
// @access  Private (Admin, Editor)
router.post('/', [auth, authorize('Admin', 'Editor')], createWine);

// @desc    Update a wine
// @access  Private (Admin, Editor)
router.put('/:id', [auth, authorize('Admin', 'Editor')], updateWine);

// @desc    Delete a wine
// @access  Private (Admin, Editor)
router.delete('/:id', [auth, authorize('Admin', 'Editor')], deleteWine);

module.exports = router;
