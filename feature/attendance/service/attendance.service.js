import Attendance from "../model/attendance.model.js";

class AttendanceService {
  createNewAttendance = async (data = { eventId: "", memberId: "" }) => {
    try {
      const newAttendance = new Attendance(data);
      await newAttendance.save();

      return await this.getAttendanceById(newAttendance.id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi đăng ký tham gia sự kiện";
    }
  };

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

  checkIn = async (data = { eventId: "", memberId: "" }) => {
    try {
      const attendance = await Attendance.findOneAndUpdate(
        { ...data },
        { status: "attended" }
      );

      return await this.getAttendanceById(attendance.id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi đăng ký tham gia sự kiện";
    }
  };
}

export default new AttendanceService();
