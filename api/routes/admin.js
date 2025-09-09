const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  listUsers,
  updateUser,
  deleteUser
} = require('../controllers/adminController');

// All routes in this file are protected and for Admins only
router.use(auth, authorize('Admin'));

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', listUsers);

// @route   PUT api/admin/users/:id
// @desc    Update a user's role
// @access  Private (Admin)
router.put('/users/:id', updateUser);

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/users/:id', deleteUser);

module.exports = router;
