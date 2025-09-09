const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { analyzeLabel } = require('../controllers/ai/aiController');

// Configure multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST api/ai/analyze-label
// @desc    Accepts an image and returns a mock AI analysis
// @access  Private
router.post(
  '/analyze-label',
  auth,
  upload.single('labelImage'),
  analyzeLabel
);

module.exports = router;
