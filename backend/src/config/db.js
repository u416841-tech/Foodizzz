const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // give Atlas 10s to respond
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('→ Check: 1) Atlas IP whitelist  2) Cluster is not paused  3) MONGODB_URI in .env is correct');
    // Don't crash the server — API routes that don't need DB will still work
    // process.exit(1);
  }
};

module.exports = connectDB;