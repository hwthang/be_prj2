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
import { StreamClient } from "@stream-io/node-sdk";

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
/* =====================
   VIDEO CALL APIs
===================== */

// 📞 Request call (A gọi B)
app.post("/api/calls/request", async (req, res) => {
  const { from, to, callId } = req.body;

  if (!from || !to) {
    return res.status(400).send(buildResponse("Invalid payload", false));
  }
  const io = SocketManager.getIO();

  console.log(`📞 ${from} gọi ${to} | callId=${callId}`);

  io.to(to).emit("call:incoming", {
    from,
    to,
    callId,
  });

  return res.send(buildResponse("Request call success", true, { callId }));
});

// ✅ Accept call (B nhận cuộc gọi)
app.post("/api/calls/accept", async (req, res) => {
  const { from, to, callId } = req.body;
  const io = SocketManager.getIO();

  console.log(`✅ ${from} accepted call ${callId}`);

  io.to(to).emit("call:accepted", {
    from,
    to,
    callId,
  });

  return res.send(buildResponse("Accept call success", true));
});

// ❌ Reject call (B từ chối)
app.post("/api/calls/reject", async (req, res) => {
  const { from, to, callId } = req.body;
  const io = SocketManager.getIO();

  console.log(`❌ ${from} rejected call ${callId}`);

  io.to(to).emit("call:rejected", {
    from,
    to,
    callId,
  });

  return res.send(buildResponse("Reject call success", true));
});

// 🚫 Cancel call (A hủy khi chưa bắt)
app.post("/api/calls/cancel", async (req, res) => {
  const { from, to, callId } = req.body;

  if (!from || !to || !callId) {
    return res.status(400).send(buildResponse("Invalid payload", false));
  }

  const io = SocketManager.getIO();

  console.log(`🚫 ${from} cancelled call ${callId}`);

  io.to(to).emit("call:cancelled", {
    from,
    to,
    callId,
  });

  return res.send(buildResponse("Cancel call success", true));
});

const apiKey = process.env.GETSTREAM_API_KEY;
const secret = process.env.GETSTREAM_SECRET;
const streamClient = new StreamClient(apiKey, secret);

// token validity (1 hour)
const validity = 60 * 60;
// 🔚 End call (đang gọi thì kết thúc)
app.post("/api/calls/end", async (req, res) => {
  const { from, to, callId } = req.body;
  const io = SocketManager.getIO();

  console.log(`🔚 ${from} ended call ${callId}`);

  io.to(to).emit("call:ended", {
    from,
    to,
    callId,
  });

  return res.send(buildResponse("End call success", true));
});
app.post("/create-user-token", async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing user id" });
    }

    const user = { id, name };

    await streamClient.upsertUsers([user]);

    const token = streamClient.generateUserToken({
      user_id: id,
      validity_in_seconds: validity,
    });

    res.json({
      apiKey,
      user,
      token,
    });
  } catch (err) {
    console.error("❌ create-user-token error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 Listen
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
