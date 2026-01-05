import { Router } from "express";
import attendanceController from "../controller/attendance.controller.js";
import Attendance from "../model/attendance.model.js";

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

AttendanceRoute.delete("/", async (req, res) => {
  const data = req.body;
  await Attendance.findOneAndDelete({
    eventId: data?.eventId,
    memberId: data?.memberId,
  });
  res.json({ delete: true });
});

export default AttendanceRoute;
