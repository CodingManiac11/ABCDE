const Item = require('../models/Item');
const { validationResult } = require('express-validator');

// @desc    Create a new item
// @route   POST /api/items
// @access  Private/Admin
const createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, countInStock, image } = req.body;

    const item = new Item({
      name,
      description,
      price,
      category,
      countInStock,
      image: image || 'no-photo.jpg',
      user: req.user._id,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Item.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Item.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const items = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.json({
      success: true,
      count: items.length,
      pagination,
      data: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate({
      path: 'reviews',
      select: 'rating comment',
      populate: {
        path: 'user',
        select: 'name',
      },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private/Admin
const updateItem = async (req, res) => {
  try {
    const { name, description, price, category, countInStock, image } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.category = category || item.category;
    item.countInStock = countInStock || item.countInStock;
    item.image = image || item.image;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new review
// @route   POST /api/items/:id/reviews
// @access  Private
const createItemReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rating, comment } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = item.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: 'Item already reviewed by this user' });
    }

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    item.reviews.push(review);
    item.numReviews = item.reviews.length;
    item.rating =
      item.reviews.reduce((acc, item) => item.rating + acc, 0) /
      item.reviews.length;

    await item.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get top rated items
// @route   GET /api/items/top
// @access  Public
const getTopItems = async (req, res) => {
  try {
    const items = await Item.find({}).sort({ rating: -1 }).limit(3);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  createItemReview,
  getTopItems,
};
