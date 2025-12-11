import mongoose from "mongoose";

export const connect_db = async () => {
  try {
    const uri = process.env.MONGODB_CONNECT_STRING;
    if (!uri) {
      throw new Error("Missing MONGODB_CONNECT_STRING in environment variables");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // Dừng app nếu không kết nối được DB
  }
};
