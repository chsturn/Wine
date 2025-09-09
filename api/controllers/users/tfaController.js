const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

exports.login2FA = async (req, res) => {
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
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, finalToken) => {
                if (err) throw err;
                res.json({ token: finalToken });
            });
        } else {
            res.status(400).json({ msg: 'Invalid 2FA token' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Invalid or expired temporary token' });
    }
};

exports.setup2FA = async (req, res) => {
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
};

exports.verify2FA = async (req, res) => {
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
};

exports.disable2FA = async (req, res) => {
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
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();
    res.json({ msg: '2FA disabled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
