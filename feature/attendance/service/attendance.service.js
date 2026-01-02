import Attendance from "../model/attendance.model.js";

class AttendanceService {
  /* =========================
      CREATE ATTENDANCE
  ========================= */
  createNewAttendance = async (data = { eventId: "", memberId: "" }) => {
    try {
      const existed = await Attendance.findOne({
        eventId: data.eventId,
        memberId: data.memberId,
      });

      if (existed) {
        return "Bạn đã đăng ký sự kiện này";
      }

      const newAttendance = new Attendance({
        ...data,
        status: "registered",
      });

      await newAttendance.save();
      return await this.getAttendanceById(newAttendance._id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi đăng ký tham gia sự kiện";
    }
  };

  /* =========================
      GET ATTENDANCE BY ID
  ========================= */
  getAttendanceById = async (id) => {
    try {
      return await Attendance.findById(id)
        .populate("memberId")
        .populate("eventId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy đăng ký tham gia sự kiện";
    }
  };

  /* =========================
      GET EVENTS BY MEMBER
  ========================= */
  getMemberAttendanceByMemberId = async (memberId) => {
    try {
      const data = await Attendance.find({ memberId })
        .select("eventId -_id")
        .lean();

      return data.map((item) => item.eventId);
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách sự kiện đã đăng ký";
    }
  };

  /* =========================
      GET ATTENDANCES BY EVENT
  ========================= */
  getAttendanceByEventId = async (eventId) => {
    try {
      return await Attendance.find({ eventId })
        .populate({
          path: "memberId",
          populate: {
            path: "accountId",
          },
        })
        .populate("eventId")
        .sort({ createdAt: -1 });
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách đăng ký theo sự kiện";
    }
  };

  /* =========================
      CHECK IN
  ========================= */
  checkIn = async (data = { eventId: "", memberId: "" }) => {
    try {
      const attendance = await Attendance.findOneAndUpdate(
        { ...data },
        { status: "attended" },
        { new: true }
      );

      if (!attendance) {
        return "Không tìm thấy đăng ký tham gia";
      }

      return await this.getAttendanceById(attendance._id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi điểm danh";
    }
  };
}

export default new AttendanceService();
