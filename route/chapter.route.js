import express from "express";
import upload from "../middleware/upload.middleware.js";
import chapterController from "../controller/chapter.controller.js";

const ChapterRoute = express.Router();

ChapterRoute.post("/", upload.single("avatar"), chapterController.create);

ChapterRoute.get("/", chapterController.getAll);

ChapterRoute.get("/:id", chapterController.getById);

ChapterRoute.put("/:id", upload.single("avatar"), chapterController.update);

ChapterRoute.patch("/:id/activate", chapterController.activate);

ChapterRoute.patch("/:id/lock", chapterController.lock);

// // Lấy chi đoàn theo ID

// // Tạo chi đoàn mới (kèm upload avatar)
// ChapterRoute.post("/", upload.single("avatar"), chapterController.create);

// // Cập nhật chi đoàn (kèm upload avatar)

export default ChapterRoute;
