require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Sample products data
const sampleProducts = [
  {
    name: 'Wireless Headphones',
    price: 99.99,
    description: 'High-quality wireless headphones with noise cancellation',
    image: '/images/headphones.jpg',
    countInStock: 10,
  },
  {
    name: 'Smartphone X',
    price: 699.99,
    description: 'Latest smartphone with advanced features',
    image: '/images/phone.jpg',
    countInStock: 15,
  },
  {
    name: 'Laptop Pro',
    price: 1299.99,
    description: 'Powerful laptop for professionals',
    image: '/images/laptop.jpg',
    countInStock: 8,
  },
  {
    name: 'Smart Watch',
    price: 199.99,
    description: 'Track your fitness and stay connected',
    image: '/images/watch.jpg',
    countInStock: 20,
  },
  {
    name: 'Bluetooth Speaker',
    price: 79.99,
    description: 'Portable speaker with great sound quality',
    image: '/images/speaker.jpg',
    countInStock: 12,
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');
    
    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length} products added successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
