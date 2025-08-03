const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  name: String,
  image: String
}, { _id: true });

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  subTotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate subtotal, tax, and total before saving
CartSchema.methods.calculateTotals = async function() {
  const TAX_RATE = 0.1; // 10% tax rate
  
  // Calculate subtotal
  this.subTotal = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Calculate tax
  this.tax = parseFloat((this.subTotal * TAX_RATE).toFixed(2));
  
  // Calculate total
  this.total = parseFloat((this.subTotal + this.tax).toFixed(2));
  
  // Update the cart items with product details
  await Promise.all(this.items.map(async (item) => {
    if (!item.name || !item.image) {
      const product = await mongoose.model('Product').findById(item.product);
      if (product) {
        item.name = product.name;
        item.image = product.image;
      }
    }
  }));
  
  return this.save();
};

// Prevent duplicate cart items
CartSchema.pre('save', async function(next) {
  const cart = this;
  
  // Only run this if items were modified
  if (cart.isModified('items')) {
    // Remove items with quantity <= 0
    cart.items = cart.items.filter(item => item.quantity > 0);
    
    // Calculate totals
    await cart.calculateTotals();
  }
  
  next();
});

// Static method to get cart by user ID
CartSchema.statics.findByUserId = function(userId) {
  return this.findOne({ user: userId });
};

// Create index for faster querying
CartSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Cart', CartSchema);
