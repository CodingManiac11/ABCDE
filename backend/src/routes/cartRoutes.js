const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', getCart);

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
router.post(
  '/items',
  [
    check('itemId', 'Item ID is required').not().isEmpty(),
    check('itemId', 'Invalid item ID').isMongoId(),
    check('quantity', 'Quantity must be a number').optional().isInt({ min: 1 }),
  ],
  addItemToCart
);

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:itemId
// @access  Private
router.put(
  '/items/:itemId',
  [
    check('quantity', 'Quantity is required').isInt({ min: 0 }),
    check('itemId', 'Invalid item ID').isMongoId(),
  ],
  updateCartItem
);

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
router.delete('/items/:itemId', [
  check('itemId', 'Invalid item ID').isMongoId(),
], removeItemFromCart);

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', clearCart);

module.exports = router;
