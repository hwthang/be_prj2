import { Router } from "express";
import memberController from "../controller/member.controller.js";

const MemberRoute = Router();

MemberRoute.post("/", memberController.createNewMember);
MemberRoute.get("/", memberController.getAllMembers);
MemberRoute.get("/leaderboard", memberController.getLeaderBoard);
MemberRoute.get("/:id", memberController.getMemberById);
MemberRoute.put("/:id", memberController.updateMemberById);

export default MemberRoute;
