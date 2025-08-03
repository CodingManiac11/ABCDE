const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return next(new ErrorResponse('No order items', 400));
    }

    // Get the products from the database to verify prices and stock
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map(x => x.product) }
    });

    // Map over the order items and check if they exist and are in stock
    const dbItems = orderItems.map(itemFromClient => {
      const matchingItem = itemsFromDB.find(
        itemFromDB => itemFromDB._id.toString() === itemFromClient.product
      );

      if (!matchingItem) {
        throw new Error(`Product not found: ${itemFromClient.product}`);
      }

      if (matchingItem.inventory < itemFromClient.quantity) {
        throw new Error(`Not enough stock for: ${matchingItem.name}`);
      }

      // Update the product inventory
      matchingItem.inventory -= itemFromClient.quantity;
      matchingItem.save();

      return {
        name: matchingItem.name,
        quantity: itemFromClient.quantity,
        image: matchingItem.image,
        price: matchingItem.price,
        product: matchingItem._id
      };
    });

    const order = new Order({
      orderItems: dbItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse('Not authorized to view this order', 401)
      );
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Check if user is authorized to update this order
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse('Not authorized to update this order', 401)
      );
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return next(
        new ErrorResponse(
          `Status must be one of: ${validStatuses.join(', ')}`,
          400
        )
      );
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    // Update status and related fields
    order.status = status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (status === 'cancelled' && order.paymentMethod !== 'cod') {
      // Implement refund logic here if needed
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
