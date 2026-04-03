const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Stop the server if database fails
  }
};

module.exports = connectDB;