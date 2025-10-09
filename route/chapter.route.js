import express from "express"
import chapterController from "../controller/chapter.controller.js"

const ChapterRoute = express.Router()

ChapterRoute.post("/", chapterController.createNewChapter)

export default ChapterRoute