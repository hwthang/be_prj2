import chapterService from "../service/chapter.service.js";
import ResponseBuilder from "../utils/response.helper.js";

class ChapterController {
  // 🧩 Tạo chi đoàn
  createChapter = async (req, res) => {
    try {
      const input = req.body;
      const result = await chapterService.createChapter(input);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Tạo chi đoàn thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi tạo chi đoàn", null, 500).send(res);
    }
  };

  // 🧩 Lấy danh sách chi đoàn
  getChapters = async (req, res) => {
    try {
      const result = await chapterService.getChapters();

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Lấy danh sách chi đoàn thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi lấy danh sách chi đoàn", null, 500).send(res);
    }
  };

  // 🧩 Lấy thông tin chi đoàn
  getChapter = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await chapterService.getChapter(id);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Lấy thông tin chi đoàn thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi lấy thông tin chi đoàn", null, 500).send(res);
    }
  };

  // 🧩 Cập nhật chi đoàn
  updateChapter = async (req, res) => {
    try {
      const id = req.params.id;
      const input = req.body;
      console.log(id)
      const result = await chapterService.updateChapter(id, input);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Cập nhật chi đoàn thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi cập nhật chi đoàn", null, 500).send(res);
    }
  };

  // 🧩 Kích hoạt chi đoàn
  activeChapter = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await chapterService.activeChapter(id);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Kích hoạt chi đoàn thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi kích hoạt chi đoàn", null, 500).send(res);
    }
  };

  // 🧩 Khóa chi đoàn
  lockChapter = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await chapterService.lockChapter(id);

      if (typeof result === "string") {
        return ResponseBuilder.error(result).send(res);
      }

      return ResponseBuilder.success("Khóa chi đoàn thành công", result).send(res);
    } catch (error) {
      console.log(error);
      ResponseBuilder.error("Lỗi khi khóa chi đoàn", null, 500).send(res);
    }
  };
}

export default new ChapterController();
