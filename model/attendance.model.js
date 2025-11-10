import { model, Schema } from "mongoose";

const AttendanceSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", default: null },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", default: null },
    status: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Attendance = model("Attendance", AttendanceSchema);

export default Attendance;
