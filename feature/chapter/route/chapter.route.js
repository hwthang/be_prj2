import express from "express";
import chapterController from "../controller/chapter.controller.js";

const ChapterRoute = express.Router();

ChapterRoute.post("/", chapterController.createNewChapter);
ChapterRoute.get("/", chapterController.getAllChapters);
ChapterRoute.get("/:id", chapterController.getChapterById);
ChapterRoute.put("/:id", chapterController.updateChapterById);

export default ChapterRoute;
