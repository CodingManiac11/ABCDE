const Cart = require('../models/Cart');
const Item = require('../models/Item');
const { validationResult } = require('express-validator');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.item',
      'name price image countInStock'
    );

    if (!cart) {
      return res.status(200).json({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    // Filter out items that are out of stock or removed
    const validItems = cart.items.filter((cartItem) => {
      // If item is populated and exists in inventory
      return cartItem.item && cartItem.item.countInStock > 0;
    });

    // Update cart if some items were filtered out
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.json({
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addItemToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { itemId, quantity = 1 } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.countInStock < quantity) {
      return res.status(400).json({
        message: `Only ${item.countInStock} items available in stock`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.item.toString() === itemId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already in cart
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > item.countInStock) {
        return res.status(400).json({
          message: `Cannot add more than ${item.countInStock} items to cart`,
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        item: item._id,
        name: item.name,
        image: item.image || 'no-photo.jpg',
        price: item.price,
        quantity,
      });
    }

    await cart.save();
    
    // Populate the item details in the response
    const populatedCart = await cart.populate('items.item', 'name price image countInStock');
    
    res.status(201).json({
      items: populatedCart.items,
      totalItems: populatedCart.totalItems,
      totalPrice: populatedCart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/items/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (quantity > item.countInStock) {
      return res.status(400).json({
        message: `Only ${item.countInStock} items available in stock`,
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.item.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    
    // Populate the item details in the response
    const populatedCart = await cart.populate('items.item', 'name price image countInStock');
    
    res.json({
      items: populatedCart.items,
      totalItems: populatedCart.totalItems,
      totalPrice: populatedCart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Private
const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.item.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    // Populate the item details in the response
    const populatedCart = await cart.populate('items.item', 'name price image countInStock');
    
    res.json({
      items: populatedCart.items,
      totalItems: populatedCart.totalItems,
      totalPrice: populatedCart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
};
