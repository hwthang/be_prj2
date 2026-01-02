import { Router } from "express";
import attendanceController from "../controller/attendance.controller.js";

const AttendanceRoute = Router();

AttendanceRoute.post("/", attendanceController.createNewAttendance);
AttendanceRoute.patch("/check-in", attendanceController.checkIn);

// Member
AttendanceRoute.get(
  "/members/:memberId",
  attendanceController.getMemberAttendanceByMemberId
);

// Event
AttendanceRoute.get(
  "/events/:eventId",
  attendanceController.getAttendanceByEventId
);

export default AttendanceRoute;
