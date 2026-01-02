import { buildResponse } from "../../../utils/response.helper.js";
import Member from "../../member/model/member.model.js";
import SocketManager from "../../socket/SocketManager.js";
import eventService from "../service/event.service.js";

class EventController {
  createNewEvent = async (req, res) => {
    try {
      const data = { ...req.body };
      const result = await eventService.createNewEvent(data);
      if (typeof result == "string")
        return res.json(buildResponse(result, false));

      const io = SocketManager.getIO();

      const rawMembers = await Member.find({ chapterId: data.chapterId })
        .select("accountId -_id")
        .lean();
      const memberIds = rawMembers.map((item) => item.accountId.toString());

      console.log(memberIds);

      io.to(memberIds).emit("new_event_for_member", result._id);

      return res.json(
        buildResponse("Tạo sự kiện thành công", true, { newEvent: result })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi tạo sự kiện", false));
    }
  };

  getAllEvents = async (req, res) => {
    try {
      const { chapterId } = req.query;
      const result = chapterId
        ? await eventService.getAllEventsOfChapter(chapterId)
        : await eventService.getAllEvents();
      if (typeof result == "string")
        return res.json(buildResponse(result, false));
      return res.json(
        buildResponse("Lấy danh sách sự kiện thành công", true, {
          events: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy danh sách sự kiện", false));
    }
  };

  getEventById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await eventService.getEventById(id);
      if (typeof result == "string")
        return res.json(buildResponse(result, false));
      return res.json(
        buildResponse("Lấy thông tin sự kiện thành công", true, {
          event: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy thông tin sự kiện", false));
    }
  };

  updateEventById = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(req.body);

      const data = {
        ...req.body,
      };
      console.log("REQ BODY:", req.body);

      const result = await eventService.updateEventById(id, data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Cập nhật thông tin sự kiện thành công", true, {
          event: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi cập nhật sự kiện", false));
    }
  };

  updateImagesEventById = async (req, res) => {
    try {
      const { id } = req.params;
      const images = req.files;
      const result = await eventService.updateImagesOfEventById(id, images);
      if (typeof result == "string")
        return res.json(buildResponse(result, false));
      return res.json(
        buildResponse("Cập nhật hình ảnh sự kiện thành công", true, {
          event: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(
        buildResponse("Lỗi khi cập nhật hình ảnh sự kiện", false)
      );
    }
  };

  cancelEventById = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await eventService.cancelEventById(id);
      if (typeof result == "string")
        return res.json(buildResponse(result, false));
      return res.json(
        buildResponse("Hủy sự kiện thành công", true, {
          event: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi hủy sự kiện", false));
    }
  };

  createEventPostById = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await eventService.createEventPostById(id);
      if (typeof result == "string")
        return res.json(buildResponse(result, false));
      return res.json(
        buildResponse("Tạo bài đăng sự kiện thành công", true, {
          event: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi tạo bài đăng sự kiện", false));
    }
  };
}
export default new EventController();
