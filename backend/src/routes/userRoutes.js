const express = require('express');
const { check } = require('express-validator');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');

const router = express.Router();

// @desc    Register a new user & get token
// @route   POST /api/users
// @access  Public
router.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  registerUser
);

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authUser
);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.route('/profile').get(protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
  ],
  updateUserProfile
);

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.route('/').get(protect, admin, getUsers);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.route('/:id').delete(protect, admin, deleteUser);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
router.route('/:id').get(protect, admin, getUserById);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('isAdmin', 'isAdmin must be a boolean').isBoolean(),
  ],
  updateUser
);

module.exports = router;
