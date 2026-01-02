import documentService from "../service/document.service.js";
import { buildResponse } from "../../../utils/response.helper.js";

class DocumentController {
  // Tạo tài liệu
  createNewDoc = async (req, res) => {
    try {
      const data = { ...req.body };

      const result = await documentService.createNewDoc(data);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Tạo tài liệu thành công", true, {
          document: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi tạo tài liệu", false));
    }
  };

  // Lấy tất cả tài liệu
  getAllDocuments = async (req, res) => {
    try {
      const { chapterId } = req.query;
      const result = chapterId
        ? await documentService.getAllDocumentsOfChapter(chapterId)
        : await documentService.getAllDocuments();
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy danh sách tài liệu thành công", true, {
          documents: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy danh sách tài liệu", false));
    }
  };

  // Lấy 1 tài liệu theo ID
  getDocumentById = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await documentService.getDocumentById(id);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Lấy thông tin tài liệu thành công", true, {
          document: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi lấy thông tin tài liệu", false));
    }
  };

  // Cập nhật tài liệu theo ID
  updateDocumentById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = { ...req.body};

      const result = await documentService.updateDocumentById(id, data);
      if (typeof result === "string")
        return res.json(buildResponse(result, false));

      return res.json(
        buildResponse("Cập nhật tài liệu thành công", true, {
          document: result,
        })
      );
    } catch (error) {
      console.log(error);
      return res.json(buildResponse("Lỗi khi cập nhật tài liệu", false));
    }
  };
}

export default new DocumentController();
