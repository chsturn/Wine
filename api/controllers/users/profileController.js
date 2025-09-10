const bcrypt = require('bcryptjs');
const User = require('../../models/User');

// @desc    Get current user's profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    // req.user is attached by the auth middleware and already excludes the password
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user's profile (firstname, lastname, birthdate)
// @access  Private
exports.updateProfile = async (req, res) => {
  const { firstname, lastname, birthdate } = req.body;

  const profileFields = {};
  if (firstname) profileFields.firstname = firstname;
  if (lastname) profileFields.lastname = lastname;
  if (birthdate) profileFields.birthdate = birthdate;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Change user's password
// @access  Private
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: 'Please provide current and new passwords' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid current password' });
    }

    // The pre-save hook in the User model will hash the new password
    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
