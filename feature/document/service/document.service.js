import Document from "../model/document.model.js";

class DocumentService {
  checkIsDocumentDuplicated = async (
    doc = {
      chapterId: null,
      docCode: null,
    },
    excludedId = null
  ) => {
    const queryExclude = excludedId ? { _id: { $ne: excludedId } } : {};

    if (
      await Document.findOne({
        chapterId: doc.chapterId,
        docCode: doc.docCode,
        ...queryExclude,
      })
    )
      return `Chi đoàn có tài liệu tương tự`;

    return false;
  };

  createNewDoc = async (
    data = {
      chapterId: null,
      name: null,
      type: null,
      scope: null,
      docCode: null,
      issuedAt: null,
      description: null,
      file: null,
    }
  ) => {
    try {
      const isDocumentExisted = await this.checkIsDocumentDuplicated(data);
      if (isDocumentExisted) return isDocumentExisted;

      const newDocument = new Document({
        ...data,
      });

      await newDocument.save();
      return this.getDocumentById(newDocument.id);
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo tài liệu";
    }
  };

  getAllDocuments = async () => {
    try {
      return await Document.find().populate("chapterId").populate("postId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách tài liệu";
    }
  };

  getAllDocumentsOfChapter = async (chapterId) => {
    try {
      return await Document.find({ chapterId: chapterId })
        .populate("chapterId")
        .populate("postId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách tài liệu";
    }
  };

  getDocumentById = async (id) => {
    try {
      return await Document.findById(id)
        .populate("chapterId")
        .populate("postId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy thông tin tài liệu";
    }
  };

  updateDocumentById = async (
    id,
    data = {
      name: null,
      type: null,
      scope: null,
      docCode: null,
      issuedAt: null,
      description: null,
      file: null,
    }
  ) => {
    try {
      const isDocumentExisted = await this.checkIsDocumentDuplicated(data, id);
      if (isDocumentExisted) return isDocumentExisted;

      return await Document.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo tài liệu";
    }
  };
}

export default new DocumentService();
