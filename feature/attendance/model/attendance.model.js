import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref:"Event", default: null },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref:"Member", default: null },
    status: { type: String, default: "" },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
