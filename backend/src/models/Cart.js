const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be at least 0'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalItems: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate total price and total items before saving
cartSchema.pre('save', function (next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

// Add item to cart
cartSchema.methods.addItemToCart = async function (item, quantity = 1) {
  const itemIndex = this.items.findIndex(
    (cartItem) => cartItem.item.toString() === item._id.toString()
  );

  if (itemIndex >= 0) {
    // Item exists in cart, update quantity
    this.items[itemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    this.items.push({
      item: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity,
    });
  }

  await this.save();
  return this;
};

// Remove item from cart
cartSchema.methods.removeItemFromCart = async function (itemId) {
  this.items = this.items.filter(
    (item) => item.item.toString() !== itemId.toString()
  );

  await this.save();
  return this;
};

// Update item quantity in cart
cartSchema.methods.updateItemQuantity = async function (itemId, quantity) {
  const itemIndex = this.items.findIndex(
    (item) => item.item.toString() === itemId.toString()
  );

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      return this.removeItemFromCart(itemId);
    }
    this.items[itemIndex].quantity = quantity;
    await this.save();
  }

  return this;
};

// Clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  await this.save();
  return this;
};

module.exports = mongoose.model('Cart', cartSchema);
