import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import ChapterRoute from "./route/chapter.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

  app.get('/', (req,res)=>{
    res.status(200).json({message:"Welcome to BE_PRJ2"})
  })

  app.use('/api/chapters', ChapterRoute)

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
