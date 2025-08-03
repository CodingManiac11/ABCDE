const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...'.yellow);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'ecommerce',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(`Database Name: ${conn.connection.name}`.cyan.underline);
    
    // Log successful connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB'.green);
    });

    // Log error after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:'.red, err);
    });

    // Log when the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection disconnected'.red);
    });

    // Close the Mongoose connection when the Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination'.yellow);
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB Connection Error:'.red.underline.bold);
    console.error(`- URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`.red);
    console.error(`- Error: ${error.message}`.red);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nCommon solutions:'.yellow);
      console.error('1. Check if MongoDB Atlas IP whitelist includes your current IP'.yellow);
      console.error('2. Verify your MongoDB connection string is correct'.yellow);
      console.error('3. Check if MongoDB service is running'.yellow);
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
