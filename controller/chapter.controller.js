import chapterService from "../service/chapter.service.js";

class ChapterControler {
  create = async (req, res) => {
    try {
      if (req.file) {
        req.body.avatar = req.file;
      }

      console.log(req.file);
      const result = await chapterService.create(req.body);
      console.log(`${typeof result}`)
      return res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json("Lỗi server");
    }
  };

  getAll = async (req, res) => {
    try {
      const result = await chapterService.getAll();
      if (typeof result == "string") {
        res.status(200).json({ message: result });
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Lỗi khi lấy danh sách chi đoàn" });
    }
  };

  getById = async (req, res) => {
    try {
      const result = await chapterService.getById(req.params.id);
      if (typeof result == "string") {
        res.status(200).json({ message: result });
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Lỗi khi lấy thông tin chi đoàn" });
    }
  };

  update = async (req, res) => {
    try {
      if (req.file) {
        req.body.avatar = req.file;
      }

      const result = await chapterService.update(req.params.id, req.body);

      if (typeof result == "string") {
        res.status(200).json({ message: result });
        return;
      }
      res.status(201).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Lỗi khi cập nhật chi đoàn" });
    }
  };

  activate = async (req, res) => {
    try {
      const result = await chapterService.activate(req.params.id);

      if (typeof result == "string") {
        res.status(200).json({ message: result });
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Lỗi khi kích hoạt chi đoàn" });
    }
  };
  lock = async (req, res) => {
    try {
      const result = await chapterService.lock(req.params.id);

      if (typeof result == "string") {
        res.status(200).json({ message: result });
        return;
      }
      res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Lỗi khi khóa chi đoàn" });
    }
  };
}

export default new ChapterControler();
