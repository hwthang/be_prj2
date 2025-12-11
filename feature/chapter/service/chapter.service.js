import Account from "../../account/model/account.model.js";
import accountService from "../../account/service/account.service.js";
import Chapter from "../model/chapter.model.js";

class ChapterService {
  checkIsChapterExisted = async (
    chapter = { name: "", affiliated: "" },
    excludedId = null
  ) => {
    const queryExclude = excludedId ? { _id: { $ne: excludedId } } : {};

    if (
      await Chapter.findOne({
        name: chapter.name,
        affiliated: chapter.affiliated,
        ...queryExclude,
      })
    )
      return `${affiliated} đã tồn tại chi đoàn có tên ${chapter.name}`;

    return false;
  };

  createNewChapter = async (
    data = {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      name: "",
      affliated: "",
      establishedAt: "",
      address: "",
    }
  ) => {
    try {
      const isAccountExisted = await accountService.checkIsAccountExisted(data);
      if (typeof isAccountExisted == "string") return isAccountExisted;

      const isChapterExisted = await this.checkIsChapterExisted(data);
      if (typeof isChapterExisted == "string") return isChapterExisted;

      const newAccount = new Account({
        ...data,
        displayName: data.name,
        type: "chapter",
      });
      const newChapter = new Chapter({ ...data, accountId: newAccount.id });

      await newChapter.save();
      await newAccount.save();

      return await newChapter.populate("accountId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo chi đoàn";
    }
  };

  getAllChapters = async () => {
    try {
      const chapters = await Chapter.find().populate("accountId");
      return chapters;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách chi đoàn";
    }
  };

  getChapterById = async (id) => {
    try {
      const chapter = await Chapter.findById(id).populate("accountId");
      return chapter;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách chi đoàn";
    }
  };

  updateChapterById = async (
    id,
    data = {
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      name: "",
      affliated: "",
      establishedAt: "",
      address: "",
    }
  ) => {
    try {
      const currentChapter = await Chapter.findById(id);
      const isAccountExisted = await accountService.checkIsAccountExisted(
        data,
        currentChapter.accountId
      );
      if (typeof isAccountExisted == "string") return isAccountExisted;

      const isChapterExisted = await this.checkIsChapterExisted(data, id);
      if (typeof isChapterExisted == "string") return isChapterExisted;

      await Account.findByIdAndUpdate(
        currentChapter.accountId,
        { ...data, displayName: data.name },
        { new: true }
      );

      await Chapter.findByIdAndUpdate(id, { ...data }, { new: true });

      return await Chapter.findById(id).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo chi đoàn";
    }
  };
}

export default new ChapterService();
