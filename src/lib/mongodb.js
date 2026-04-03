import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    // If we are already connected, don't connect again!
    if (mongoose.connection.readyState === 1) {
      return;
    }
    
    // Replace the string below with your actual process.env.MONGODB_URI
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB: ", error);
  }
};

export default connectMongoDB;