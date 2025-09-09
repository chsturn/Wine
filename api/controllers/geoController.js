const Wine = require('../models/Wine');

// @desc    Get wines within a certain radius of a point
// @route   GET /api/geo/nearby?lon=...&lat=...&dist=...
exports.getWinesNearby = async (req, res) => {
  const { lon, lat, dist } = req.query;

  if (!lon || !lat || !dist) {
    return res.status(400).json({ msg: 'Please provide longitude, latitude, and distance.' });
  }

  const longitude = parseFloat(lon);
  const latitude = parseFloat(lat);
  const maxDistance = parseInt(dist, 10); // in meters

  try {
    const wines = await Wine.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      }
    });
    res.json(wines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get wines within a rectangular bounding box
// @route   GET /api/geo/within-bounds?sw_lon=...&sw_lat=...&ne_lon=...&ne_lat=...
exports.getWinesWithinBounds = async (req, res) => {
  const { sw_lon, sw_lat, ne_lon, ne_lat } = req.query;

  if (!sw_lon || !sw_lat || !ne_lon || !ne_lat) {
    return res.status(400).json({ msg: 'Please provide all four boundary coordinates.' });
  }

  const bounds = [
    [parseFloat(sw_lon), parseFloat(sw_lat)], // Bottom-left
    [parseFloat(ne_lon), parseFloat(ne_lat)]  // Top-right
  ];

  try {
    const wines = await Wine.find({
      location: {
        $geoWithin: {
          $box: bounds
        }
      }
    });
    res.json(wines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
