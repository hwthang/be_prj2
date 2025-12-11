import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import { connect_db } from "./config/db.js";
import { buildResponse } from "./utils/response.helper.js";
import AccountRoute from "./feature/account/route/account.route.js";
import ChapterRoute from "./feature/chapter/route/chapter.route.js";
import MemberRoute from "./feature/member/route/member.route.js";
import EvaluationRoute from "./feature/evaluation/route/evaluation.route.js";
import EventRoute from "./feature/event/route/event.route.js";
import AttendanceRoute from "./feature/attendance/route/attendance.route.js";
import DocumentRoute from "./feature/document/route/document.route.js";
import CommentRoute from "./feature/comment/route/comment.route.js";
import LikeRoute from "./feature/like/route/like.route.js";
import SurveyRoute from "./feature/survey/route/survey.route.js";
import QuestionRoute from "./feature/question/route/question.route.js";
import AnswerRoute from "./feature/answer/route/answer.route.js";
import upload from "./middleware/upload.middleware.js";
import { moderateContent } from "./feature/ai/gemini_ai.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Kết nối MongoDB
await connect_db();
app.post("/", async (req, res) => {
  const { type, data } = req.body;
console.log({ [type]: data })
  const response = await moderateContent({ [type]: data });
  return res.send(response);
});

app.use("/api/accounts", AccountRoute);
app.use("/api/chapters", ChapterRoute);
app.use("/api/members", MemberRoute);
app.use("/api/evaluations", EvaluationRoute);
app.use("/api/events", EventRoute);
app.use("/api/attendances", AttendanceRoute);
app.use("/api/documents", DocumentRoute);
app.use("/api/comments", CommentRoute);
app.use("/api/likes", LikeRoute);
app.use("/api/surveys", SurveyRoute);
app.use("/api/questions", QuestionRoute);
app.use("/api/answers", AnswerRoute);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
