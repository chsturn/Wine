const User = require('../models/User');

// @desc    Get all users
// @access  Private (Admin)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a user (e.g., change role)
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  const { role } = req.body;
  // Basic validation: ensure role is valid if provided
  if (role && !['User', 'Editor', 'Admin'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role specified' });
  }

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Only update the role for now
    user.role = role || user.role;
    await user.save();

    // Return user without password
    const userToReturn = user.toObject();
    delete userToReturn.password;

    res.json(userToReturn);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a user
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.remove();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
