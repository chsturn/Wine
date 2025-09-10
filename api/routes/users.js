const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  login2FA,
  setup2FA,
  verify2FA,
  disable2FA,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/users');

// --- Auth Routes ---
router.post('/register', register);
router.post('/login', login);

// --- 2FA Routes ---
router.post('/2fa/login', login2FA);
router.post('/2fa/setup', auth, setup2FA);
router.post('/2fa/verify', auth, verify2FA);
router.post('/2fa/disable', auth, disable2FA);

// --- Profile Routes ---
router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.put('/change-password', auth, changePassword);

module.exports = router;
