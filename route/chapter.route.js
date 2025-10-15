import express from "express";
import chapterController from "../controller/chapter.controller.js";

const ChapterRoute = express.Router();

ChapterRoute.post("/", chapterController.createChapter);
ChapterRoute.get("/", chapterController.getChapters);
ChapterRoute.get("/:id", chapterController.getChapter);
ChapterRoute.put("/:id", chapterController.updateChapter);
ChapterRoute.patch("/:id/active", chapterController.activeChapter);
ChapterRoute.patch("/:id/lock", chapterController.lockChapter);

export default ChapterRoute;
