import { buildResponse } from "../../../utils/response.helper.js";
import attendanceService from "../service/attendance.service.js";

class AttendanceController {
  createNewAttendance = async (req, res) => {
    try {
      const result = await attendanceService.createNewAttendance(req.body);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Đăng ký tham gia sự kiện thành công", true, {
          attendance: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi đăng ký tham gia sự kiện"));
    }
  };

  checkIn = async (req, res) => {
    try {
      const result = await attendanceService.checkIn(req.body);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Điểm danh thành công", true, {
          attendance: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi điểm danh"));
    }
  };

  getMemberAttendanceByMemberId = async (req, res) => {
    try {
      const { memberId } = req.params;
      const result =
        await attendanceService.getMemberAttendanceByMemberId(memberId);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách sự kiện đã đăng ký", true, {
          attendances: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi"));
    }
  };

  /* =========================
      NEW: GET BY EVENT ID
  ========================= */
  getAttendanceByEventId = async (req, res) => {
    try {
      const { eventId } = req.params;
      const result =
        await attendanceService.getAttendanceByEventId(eventId);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse(
          "Lấy danh sách đăng ký theo sự kiện thành công",
          true,
          { attendances: result }
        )
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi"));
    }
  };
}

export default new AttendanceController();
