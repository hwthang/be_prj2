import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

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

import { moderateContent } from "./feature/ai/gemini_ai.js";
import Account from "./feature/account/model/account.model.js";
import Chapter from "./feature/chapter/model/chapter.model.js";
import Member from "./feature/member/model/member.model.js";
import SocketManager from "./feature/socket/SocketManager.js";
import ConversationRoute from "./feature/conversation/route/conversation.route.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* =====================
   DATABASE
===================== */
await connect_db();

/* =====================
   API
===================== */
app.post("/check-content", async (req, res) => {
  const response = await moderateContent(req.body);
  return res.send(response);
});

app.get("/api/statistic/admin", async (req, res) => {
  const accounts = await Account.find({ type: { $ne: "admin" } });
  const chapters = await Chapter.find();
  const members = await Member.find();

  return res.send(buildResponse("", true, { accounts, chapters, members }));
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
app.use("/api/conversations", ConversationRoute);

/* =====================
   SERVER + SOCKET
===================== */
const PORT = process.env.PORT || 5000;

// 🔹 Tạo HTTP server từ Express
const server = http.createServer(app);

// 🔹 Init socket.io
SocketManager.init(server);

app.post("/test-socket", async (req, res) => {
  const io = SocketManager.getIO();
  io.to("6950fc2e460b4d96244a5963").emit("welcome", {
    fullname: "Thắng",
  });
  res.json(2);
});

// 🔹 Listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
