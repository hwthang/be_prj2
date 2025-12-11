import Post from "../../post/model/post.model.js";
import Event from "../model/event.model.js";

class EventService {
  getStatus = (
    event = {
      startedAt: "",
      endedAt: "",
      status: "",
    }
  ) => {
    // Nếu bị hủy → trả về "canceled"
    if (event.status === "cancel" || event.status === "canceled")
      return "canceled";

    const now = new Date();
    const start = new Date(event.startedAt);
    const end = new Date(event.endedAt);

    if (now < start) return "upcoming"; // Chưa diễn ra
    if (now >= start && now <= end) return "running"; // Đang diễn ra
    return "ended"; // Đã kết thúc
  };

  updateStatusOfEvent = async (event) => {
    const newStatus = this.getStatus(event);

    if (event.status !== newStatus) {
      await Event.findByIdAndUpdate(event._id, { status: newStatus });
      event.status = newStatus;
    }

    return event;
  };

  checkIsEventExisted = async (event, excludedId = null) => {
    const queryExclude = excludedId ? { _id: { $ne: excludedId } } : {};

    if (
      await Event.findOne({
        chapterId: event.chapterId,
        name: event.name,
        startedAt: event.startedAt,
        venue: event.venue,
        ...queryExclude,
      })
    )
      return `Chi đoàn có sự kiện tương tự`;

    return false;
  };

  createNewEvent = async (
    data = {
      chapterId: "",
      name: "",
      scope: "",
      tags: ["", ""],
      startedAt: "",
      endedAt: "",
      venue: "",
      images: [],
      description: "",
    }
  ) => {
    try {
      console.log(data);
      const isEventExisted = await this.checkIsEventExisted(data);
      if (isEventExisted) return isEventExisted;

      const newEvent = new Event({
        ...data,
        status: this.getStatus(data),
      });

      await newEvent.save();

      return await this.getEventById(newEvent.id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo sự kiện";
    }
  };

  getAllEvents = async () => {
    try {
      const events = await Event.find()
        .populate("chapterId")
        .populate("postId");

      const updatedEvents = await Promise.all(
        events.map(async (e) => await this.updateStatusOfEvent(e))
      );

      return updatedEvents;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách sự kiện";
    }
  };

  getAllEventsOfChapter = async (chapterId) => {
    try {
      const events = await Event.find({ chapterId })
        .populate("chapterId")
        .populate("postId");

      const updatedEvents = await Promise.all(
        events.map(async (e) => await this.updateStatusOfEvent(e))
      );

      return updatedEvents;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách sự kiện";
    }
  };

  getEventById = async (id) => {
    try {
      const event = await Event.findById(id)
        .populate("chapterId")
        .populate("postId");

      if (!event) return null;

      return await this.updateStatusOfEvent(event);
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy sự kiện";
    }
  };

  updateEventById = async (
    id,
    data
  ) => {
    try {
      const currentEvent = await Event.findById(id);


      const isEventExisted = await this.checkIsEventExisted(
        { ...data, chapterId: currentEvent.chapterId },
        id
      );
      if (typeof isEventExisted === "string") return isEventExisted;

      const updated = await Event.findByIdAndUpdate(
        id,
        { ...data, status: this.getStatus({ ...currentEvent._doc, ...data }) },
        { new: true }
      );

      return await this.updateStatusOfEvent(updated);
    } catch (error) {
      console.log(error);
      return "Lỗi khi cập nhật sự kiện";
    }
  };

  updateImagesOfEventById = async (id, images) => {
    try {
      const event = await Event.findById(id)
      return await Event.findByIdAndUpdate(id, { images: [...event.images,...images] });
    } catch (error) {
      console.log(error);
      return "Lỗi khi cập nhật hình ảnh sự kiện";
    }
  };

  cancelEventById = async (id) => {
    try {
      const event = await Event.findByIdAndUpdate(
        id,
        { status: "canceled" },
        { new: true }
      );

      return event;
    } catch (error) {
      console.log(error);
      return "Lỗi khi hủy sự kiện";
    }
  };

  createEventPostById = async (id) => {
    try {
      const newPost = new Post({ type: "event" });
      await newPost.save();

      const event = await Event.findByIdAndUpdate(
        id,
        { postId: newPost.id },
        { new: true }
      )
        .populate("chapterId")
        .populate("postId");

      return await this.updateStatusOfEvent(event);
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo bài đăng sự kiện";
    }
  };
}

export default new EventService();

// event.service.js (rewritten)
export const getStatus = (
  event = { startedAt: "", endedAt: "", status: "" }
) => {
  // If service already has status override
  if (event.status && event.status.toLowerCase() === "cancel") return "cancel";

  const now = new Date();
  const start = new Date(event.startedAt);
  const end = new Date(event.endedAt);

  if (isNaN(start) || isNaN(end)) return "invalid_date";

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  return "completed";
};
