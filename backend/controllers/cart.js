const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  
  // If cart doesn't exist, create a new one
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
  }

  // Find user's cart or create new one
  let cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: []
    });
  }

  // Check if item already in cart
  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Update quantity if item exists
    cart.items[itemIndex].quantity += parseInt(quantity);
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity: parseInt(quantity),
      price: product.price
    });
  }

  // Calculate totals
  await cart.save();
  await cart.calculateTotals();
  
  const populatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: populatedCart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    return next(new ErrorResponse(`Cart not found for user ${req.user.id}`, 404));
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex(
    item => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse(`Item not found in cart`, 404));
  }

  // Update quantity
  cart.items[itemIndex].quantity = parseInt(quantity);
  
  // Recalculate totals
  await cart.save();
  await cart.calculateTotals();
  
  const populatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: populatedCart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    return next(new ErrorResponse(`Cart not found for user ${req.user.id}`, 404));
  }

  // Remove item from cart
  cart.items = cart.items.filter(item => item._id.toString() !== itemId);
  
  // Recalculate totals
  await cart.save();
  await cart.calculateTotals();
  
  const populatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: populatedCart
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  
  if (!cart) {
    return next(new ErrorResponse(`Cart not found for user ${req.user.id}`, 404));
  }

  // Clear all items
  cart.items = [];
  cart.subTotal = 0;
  cart.tax = 0;
  cart.total = 0;
  
  await cart.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});
