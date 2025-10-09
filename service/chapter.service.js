import Chapter from "../model/chapter.model.js";
import userService from "./user.service.js";

const STATUS = ["active", "locked"];

class ChapterService {
  isValidChapterCode = (code) => {
    if (!code) return false;
    return true;
  };

  isValidName = (name) => {
    if (!name) return false;
    return true;
  };

  isValidAffiliated = (affiliated) => {
    if (!affiliated) return false;
    return true;
  };

  isValidOffice = (office) => {
    if (!office) return false;
    return true;
  };

  isValidStatus = (status) => {
    if (!STATUS.includes(status)) return false;
    return true;
  };

  getChapterWithKey = async (key) => {
    return await Chapter.findOne(key);
  };

  // Kiểm tra hợp lệ Chapter
  isValidChapter = async (input, isUpdating = false) => {
    const { chapterCode, name, affiliated, office } = input;

    if (!isUpdating || chapterCode) {
      if (!this.isValidChapterCode(chapterCode))
        return "Mã chi đoàn không hợp lệ";
      const exist = await this.getChapterWithKey({ chapterCode });
      if (!isUpdating && exist) return "Mã chi đoàn đã được sử dụng";
    }

    if (!isUpdating || name) {
      if (!this.isValidName(name)) return "Tên chi đoàn không hợp lệ";
    }

    if (!isUpdating || affiliated) {
      if (!this.isValidAffiliated(affiliated))
        return "Đoàn trực thuộc không hợp lệ";
    }

    if (!isUpdating || office) {
      if (!this.isValidOffice(office)) return "Văn phòng đoàn không hợp lệ";
    }

    return true;
  };

  createNewChapter = async (input) => {
    // Kiểm tra hợp lệ
    const valid = await this.isValidChapter(input);
    if (valid !== true) return valid;

    const { chapterCode, name, affiliated, office } = input;

    // Tạo Manager cho Chapter
    const manager = await userService.createNewManager({
      username: chapterCode,
      password: chapterCode, // mật khẩu mặc định là chapterCode
    });

    if (typeof manager === "string") return manager; // trả về lỗi nếu tạo Manager không thành công

    // Tạo Chapter mới
    const chapter = new Chapter({
      chapterCode,
      name,
      affiliated,
      office,
      status: "active",
      managerId: manager._id, // gán managerId
    });

    const result = {};
    result.manager = manager; // Manager đã được lưu trong createNewManager
    result.chapter = await chapter.save(); // Lưu Chapter mới

    return result;
  };

  // Cập nhật Chapter
  updateChapter = async (key, input) => {
    // Kiểm tra hợp lệ
    const valid = await this.isValidChapter(input, true);
    if (valid !== true) return valid;

    const chapter = await this.getChapterWithKey(key);
    if (!chapter) return "Chapter không tồn tại";

    const { name, affiliated, office } = input;

    if (name) chapter.name = name;
    if (affiliated) chapter.affiliated = affiliated;
    if (office) chapter.office = office;

    // Nếu muốn update Manager, có thể làm ở đây
    const result = await chapter.save();
    return result;
  };

  // Chapter
  lockChapter = async (key) => {
    const chapter = await this.getChapterWithKey(key);
    if (!chapter) return "Chapter không tồn tại";

    chapter.status = "locked";
    return await chapter.save();
  };

  unlockChapter = async (key) => {
    const chapter = await this.getChapterWithKey(key);
    if (!chapter) return "Chapter không tồn tại";

    chapter.status = "active";
    return await chapter.save();
  };
}

export default new ChapterService();
