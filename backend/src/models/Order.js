const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
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
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
  },
  { _id: false }
);

const paymentResultSchema = new mongoose.Schema(
  {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['PayPal', 'Stripe', 'CashOnDelivery'],
        message: 'Payment method is either: PayPal, Stripe, or CashOnDelivery',
      },
    },
    paymentResult: paymentResultSchema,
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate prices before saving
orderSchema.pre('save', async function (next) {
  // Calculate items price
  this.itemsPrice = this.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate shipping price (example: $10 for orders under $100, free otherwise)
  this.shippingPrice = this.itemsPrice > 100 ? 0 : 10;

  // Calculate tax price (example: 10% tax)
  this.taxPrice = Number((0.1 * this.itemsPrice).toFixed(2));

  // Calculate total price
  this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice;

  next();
});

module.exports = mongoose.model('Order', orderSchema);
