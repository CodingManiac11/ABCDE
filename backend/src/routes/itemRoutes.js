const express = require('express');
const { check } = require('express-validator');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  createItemReview,
  getTopItems,
} = require('../controllers/itemController');

const router = express.Router();

// @desc    Fetch all items
// @route   GET /api/items
// @access  Public
router.get(
  '/',
  [
    check('category', 'Please provide a valid category').optional().isString(),
    check('name', 'Name must be a string').optional().isString(),
    check('price', 'Price must be a number').optional().isNumeric(),
    check('rating', 'Rating must be a number between 0 and 5')
      .optional()
      .isFloat({ min: 0, max: 5 }),
    check('page', 'Page must be a number').optional().isInt({ min: 1 }),
    check('limit', 'Limit must be a number').optional().isInt({ min: 1 }),
    check('sort', 'Invalid sort parameter').optional().isString(),
  ],
  getItems
);

// @desc    Fetch top rated items
// @route   GET /api/items/top
// @access  Public
router.get('/top', getTopItems);

// @desc    Fetch single item
// @route   GET /api/items/:id
// @access  Public
router.get(
  '/:id',
  [check('id', 'Please provide a valid ID').isMongoId()],
  getItemById
);

// @desc    Create a new item
// @route   POST /api/items
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Please include a valid price').isFloat({ min: 0 }),
    check('category', 'Please include a valid category').isIn([
      'Electronics',
      'Books',
      'Clothing',
      'Home',
      'Beauty',
      'Sports',
      'Other',
    ]),
    check('countInStock', 'Please include a valid stock count').isInt({
      min: 0,
    }),
  ],
  createItem
);

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('price', 'Please include a valid price').isFloat({ min: 0 }),
    check('category', 'Please include a valid category').isIn([
      'Electronics',
      'Books',
      'Clothing',
      'Home',
      'Beauty',
      'Sports',
      'Other',
    ]),
    check('countInStock', 'Please include a valid stock count').isInt({
      min: 0,
    }),
  ],
  updateItem
);

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  admin,
  [check('id', 'Please provide a valid ID').isMongoId()],
  deleteItem
);

// @desc    Create new review
// @route   POST /api/items/:id/reviews
// @access  Private
router.post(
  '/:id/reviews',
  protect,
  [
    check('rating', 'Please include a rating between 1 and 5').isInt({
      min: 1,
      max: 5,
    }),
    check('comment', 'Please include a comment').not().isEmpty(),
  ],
  createItemReview
);

module.exports = router;
