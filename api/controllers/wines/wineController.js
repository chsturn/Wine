const Wine = require('../models/Wine');

// @desc    Create a new wine
exports.createWine = async (req, res) => {
  try {
    const newWine = new Wine({
      ...req.body
    });

    const wine = await newWine.save();
    res.status(201).json(wine);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Validation error', errors: err.errors });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Update a wine
exports.updateWine = async (req, res) => {
  try {
    let wine = await Wine.findById(req.params.id);
    if (!wine) {
      return res.status(404).json({ msg: 'Wine not found' });
    }

    wine = await Wine.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(wine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a wine
exports.deleteWine = async (req, res) => {
  try {
    const wine = await Wine.findById(req.params.id);
    if (!wine) {
      return res.status(404).json({ msg: 'Wine not found' });
    }

    await wine.remove();
    res.json({ msg: 'Wine removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all wines
exports.getAllWines = async (req, res) => {
  try {
    const wines = await Wine.find().sort({ createdAt: -1 });
    res.json(wines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
