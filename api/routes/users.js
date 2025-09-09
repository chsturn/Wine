const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  login2FA,
  setup2FA,
  verify2FA,
  disable2FA
} = require('../controllers/users'); // Updated path

// @route   POST api/users/register
router.post('/register', register);

// @route   POST api/users/login
router.post('/login', login);

// @route   POST api/users/2fa/login
router.post('/2fa/login', login2FA);

// @route   POST api/users/2fa/setup
router.post('/2fa/setup', auth, setup2FA);

// @route   POST api/users/2fa/verify
router.post('/2fa/verify', auth, verify2FA);

// @route   POST api/users/2fa/disable
router.post('/2fa/disable', auth, disable2FA);

module.exports = router;
