import { Router } from "express";
import attendanceController from "../controller/attendance.controller.js";

const AttendanceRoute = Router()

AttendanceRoute.post("/", attendanceController.createNewAttendance)
AttendanceRoute.patch("/check-in", attendanceController.checkIn)

export default AttendanceRoute