const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ username, password });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // --- 2FA Check ---
    if (user.twoFactorEnabled) {
      // If 2FA is enabled, issue a temporary token
      const payload = { user: { id: user.id }, purpose: '2fa' };
      const tfaToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
      return res.json({ tfa_required: true, tfa_token: tfaToken });
    }

    // --- Standard JWT Issuance ---
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/2fa/login
// @desc    Verify 2FA token during login and get final JWT
// @access  Public (but requires a temporary token)
router.post('/2fa/login', async (req, res) => {
    const { tfa_token, token } = req.body;
    if (!tfa_token || !token) {
        return res.status(400).json({ msg: 'Missing required tokens' });
    }

    try {
        const decoded = jwt.verify(tfa_token, process.env.JWT_SECRET);
        if (decoded.purpose !== '2fa') {
            return res.status(401).json({ msg: 'Invalid token purpose' });
        }

        const user = await User.findById(decoded.user.id);
        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
            return res.status(401).json({ msg: '2FA not enabled for this user' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
        });

        if (verified) {
            const payload = { user: { id: user.id } };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, finalToken) => {
                    if (err) throw err;
                    res.json({ token: finalToken });
                }
            );
        } else {
            res.status(400).json({ msg: 'Invalid 2FA token' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Invalid or expired temporary token' });
    }
});


// @route   POST api/users/2fa/setup
// @desc    Setup 2FA for a user
// @access  Private
router.post('/2fa/setup', auth, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: `WineApp:${req.user.id}` });
    await User.findByIdAndUpdate(req.user.id, { twoFactorSecret: secret.base32 });
    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error generating QR code');
      }
      res.json({ qrCodeUrl: data_url });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/2fa/verify
// @desc    Verify 2FA token and enable 2FA
// @access  Private
router.post('/2fa/verify', auth, async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ msg: '2FA not set up or user not found' });
    }
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
    });
    if (verified) {
      await User.findByIdAndUpdate(req.user.id, { twoFactorEnabled: true });
      res.json({ msg: '2FA enabled successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid 2FA token' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/2fa/disable
// @desc    Disable 2FA for a user
// @access  Private
router.post('/2fa/disable', auth, async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ msg: 'Password is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined; // or null
    await user.save();

    res.json({ msg: '2FA disabled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
