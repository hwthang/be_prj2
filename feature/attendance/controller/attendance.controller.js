import { buildResponse } from "../../../utils/response.helper.js";
import attendanceService from "../service/attendance.service.js";

class AttendanceController {
  createNewAttendance = async (req, res) => {
    try {
      const data = req.body;

      const result = await attendanceService.createNewAttendance(data);
      if (typeof result == "string")
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

  checkIn = async (req,res) => {
    try {
      const data = req.body;

      const result = await attendanceService.checkIn(data);
      if (typeof result == "string")
        return res.json(buildResponse(result, false));
      return res.json(
        buildResponse("Điểm danh đăng ký tham gia sự kiện thành công", true, {
         attendance: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi điểm danh đăng ký tham gia sự kiện"));
    }
  }
}

export default new AttendanceController();
