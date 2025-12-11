import { buildResponse } from "../../../utils/response.helper.js";
import chapterService from "../service/chapter.service.js";

class ChapterController {
  createNewChapter = async (req, res) => {
    try {
      const data = req.body;
      const result = await chapterService.createNewChapter(data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Tạo chi đoàn thành công", true, {
          chapter: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi tạo chi đoàn", false));
    }
  };

  getAllChapters = async (req, res) => {
    try {
      const result = await chapterService.getAllChapters();

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách chi đoàn thành công", true, {
          chapters: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy danh sách chi đoàn", false));
    }
  };

  getChapterById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await chapterService.getChapterById(id);

      if (!result)
        return res.json(buildResponse("Không tìm thấy chi đoàn", false));

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy thông tin chi đoàn thành công", true, {
          chapter: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy thông tin chi đoàn", false));
    }
  };

  updateChapterById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await chapterService.updateChapterById(id, data);

      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Cập nhật chi đoàn thành công", true, {
          chapter: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi cập nhật chi đoàn", false));
    }
  };
}

export default new ChapterController();
