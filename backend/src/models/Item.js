const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be at least 0'],
    },
    image: {
      type: String,
      default: 'no-photo.jpg',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Electronics',
        'Books',
        'Clothing',
        'Home',
        'Beauty',
        'Sports',
        'Other',
      ],
    },
    countInStock: {
      type: Number,
      required: [true, 'Please add count in stock'],
      min: [0, 'Count in stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete cart items when an item is deleted
itemSchema.pre('remove', async function (next) {
  await this.model('CartItem').deleteMany({ item: this._id });
  next();
});

// Reverse populate with virtuals
itemSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'item',
  justOne: false,
});

module.exports = mongoose.model('Item', itemSchema);
