const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  wineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wine',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure a user can only rate a wine once
RatingSchema.index({ wineId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);
