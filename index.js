import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors"
import UserRoute from "./route/user.route.js";
import ChapterRoute from "./route/chapter.route.js";
import AuthRoute from "./route/auth.route.js";
import userService from "./service/user.service.js";

dotenv.config();

const app = express();
app.use(cors())
// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/chapters", ChapterRoute);

// Route mẫu
app.post("/", async (req, res) => {
  const result = await userService.createNewAdmin({
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    phone: process.env.ADMIN_PHONE,
    password: process.env.ADMIN_PASSWORD,
  });

  if (result.role != "admin") res.send("Tạo admin thất bại");

  res.send("Tạo admin thành công");
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
