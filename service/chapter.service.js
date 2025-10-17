import Chapter from "../model/chapter.model.js";
import ResponseBuilder from "../utils/response.helper.js";
import userService from "./user.service.js";

class ChapterService {
  createChapter = async (input) => {
    try {
      const { chapter, manager } = input;
      const newChapter = new Chapter(chapter);
      newChapter.status = "active";
      const newManager = await userService.createUser({ account: manager });
      if (typeof newManager == "string") return newManager;
      newManager.role = "manager";
      newManager.status = "active";

      newChapter.manager = newManager.id;
      await newChapter.save();
      await newManager.save();

      const result = await Chapter.findOne({ _id: newChapter.id }).populate(
        "manager"
      );

      return result;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi tạo chi đoàn";
    }
  };

  getChapters = async () => {
    try {
      const chapters = await Chapter.find();
      return chapters;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi lấy danh sách chi đoàn";
    }
  };

  getChapter = async (id) => {
    try {
      const chapter = await Chapter.findOne({ _id: id }).populate("manager");

      const result = ResponseBuilder.success();
      result.data = chapter;

      return result;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi lấy thông tin chi đoàn";
    }
  };

  updateChapter = async (id, input) => {
    try {
      let chapter = await Chapter.findOne({ _id: id });

      Object.entries(input).forEach(([key, value]) => {
        chapter[key] = value;
      });

      const updatedChapter = await chapter.save();
      return updatedChapter;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi cập nhật chi đoàn";
    }
  };

  activeChapter = async (id) => {
    try {
      const chapter = await Chapter.findOne({ _id: id });

      chapter.status = "active";
      const activeChapter = await chapter.save();

      return activeChapter;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi kích hoạt chi đoàn";
    }
  };

  lockChapter = async (id) => {
    try {
      const chapter = await Chapter.findOne({ _id: id });

      chapter.status = "locked";
      const lockedChapter = await chapter.save();

      return lockedChapter;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi khóa chi đoàn";
    }
  };
}

export default new ChapterService();
