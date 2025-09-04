const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wine = require('../models/Wine');

// @route   POST api/wines
// @desc    Create a new wine
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // We could add validation here if needed
    const newWine = new Wine({
      ...req.body
    });

    const wine = await newWine.save();
    res.status(201).json(wine);
  } catch (err) {
    console.error(err.message);
    // Check for validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Validation error', errors: err.errors });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/wines
// @desc    Get all wines
// @access  Public
router.get('/', async (req, res) => {
  try {
    const wines = await Wine.find().sort({ createdAt: -1 });
    res.json(wines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
