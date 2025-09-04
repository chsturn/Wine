const mongoose = require('mongoose');

const wineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  winery: { type: String, required: true },
  region: { type: String, required: true },
  grapeVariety: { type: String, required: true },
  aroma: { type: [String], required: true },
  taste: { type: [String], required: true },
  oakAging: {
    oakType: { type: String, default: null },
    durationMonths: { type: Number, default: null }
  },
  foodPairing: { type: [String], required: true },
  alcoholPercentage: { type: Number, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: null },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wine', wineSchema);
