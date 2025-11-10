import express from "express";
import memberController from "../controller/member.controller.js";
import upload from "../middleware/upload.middleware.js";

const MemberRoute = express.Router();

// Lấy tất cả member
MemberRoute.get("/", memberController.getAll);

// Lấy member theo ID
MemberRoute.get("/:id", memberController.getById);

// Tạo member mới (kèm upload avatar)
MemberRoute.post("/", upload.single("avatar"), memberController.create);

// Cập nhật member (kèm upload avatar)
MemberRoute.put("/:id", upload.single("avatar"), memberController.update);

export default MemberRoute;
