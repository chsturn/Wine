const Wine = require('../../models/Wine');
const Rating = require('../../models/Rating');
const mongoose = require('mongoose');

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

// @desc    Rate a wine
// @access  Private
exports.rateWine = async (req, res) => {
  const { rating } = req.body;
  const { id: wineId } = req.params;
  const userId = req.user.id;

  if (rating === undefined || rating < 1 || rating > 10) {
    return res.status(400).json({ msg: 'Rating must be a number between 1 and 10' });
  }

  try {
    const wine = await Wine.findById(wineId);
    if (!wine) {
      return res.status(404).json({ msg: 'Wine not found' });
    }

    await Rating.findOneAndUpdate(
      { wineId, userId },
      { rating },
      { upsert: true, new: true, runValidators: true }
    );

    // After rating, we could return the updated wine with the new average rating,
    // but for simplicity, we'll just return a success message.
    // The client can refetch the wine details to get the updated average.
    res.json({ msg: 'Rating submitted successfully' });

  } catch (err) {
    console.error(err.message);
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

// @desc    Get a single wine by ID
exports.getWineById = async (req, res) => {
  try {
    const wineId = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user ? new mongoose.Types.ObjectId(req.user.id) : null;

    const aggregationPipeline = [
      { $match: { _id: wineId } },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'wineId',
          as: 'ratings'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$ratings.rating' },
          ratingsCount: { $size: '$ratings' },
        }
      }
    ];

    if (userId) {
      aggregationPipeline.push({
        $addFields: {
          userRatingObj: {
            $filter: {
              input: '$ratings',
              as: 'rating',
              cond: { $eq: ['$$rating.userId', userId] }
            }
          }
        }
      }, {
        $addFields: {
          userRating: { $arrayElemAt: ['$userRatingObj.rating', 0] }
        }
      });
    }

    aggregationPipeline.push({
      $project: { ratings: 0, userRatingObj: 0 }
    });

    const wines = await Wine.aggregate(aggregationPipeline);

    if (wines.length === 0) {
      return res.status(404).json({ msg: 'Wine not found' });
    }

    res.json(wines[0]);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Wine not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get all wines
exports.getAllWines = async (req, res) => {
  try {
    const wines = await Wine.aggregate([
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'wineId',
          as: 'ratings'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$ratings.rating' },
          ratingsCount: { $size: '$ratings' }
        }
      },
      {
        $project: {
          ratings: 0 // Exclude the ratings array from the final output
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(wines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
