import { populate } from "dotenv";
import Account from "../model/account.model.js";
import Chapter from "../model/chapter.model.js";
import bcryptHelper from "../utils/bcrypt.helper.js";
import validatorHelper from "../utils/validator.helper.js";
import cloudinary from "../config/cloudinary.js";

class ChapterService {
  create = async (input) => {
    try {
      const {
        username,
        email,
        phoneNumber,
        password,
        name,
        establishedAt,
        affiliated,
        address,
        avatar,
      } = input;

      const hasDuplicatedAccount = await validatorHelper.checkIsDuplicated(
        Account,
        [
          { key: "username", value: username },
          { key: "email", value: email },
          { key: "phoneNumber", value: phoneNumber },
        ]
      );

      if (hasDuplicatedAccount)
        return "Tên đăng nhập, email hoặc số điện thoại đã được đăng ký";
      const account = new Account({
        username,
        email,
        phoneNumber,
        password: await bcryptHelper.hashPassword(password),
        type: "chapter",
        status: "active",
      });
      if (avatar?.path) {
        account.avatar = {
          path: avatar.path,
          publicId: avatar.filename,
        };
      }

      const chapter = new Chapter({
        name,
        establishedAt,
        affiliated,
        address,
        accountId: account.id,
      });

      await account.save();
      await chapter.save();

      return await Chapter.findById(chapter.id).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Có lỗi xảy ra khi tạo chi đoàn";
    }
  };

  getAll = async () => {
    try {
      return await Chapter.find().populate("accountId");
    } catch (error) {
      return "Có lỗi xảy ra khi lấy danh sách chi đoàn";
    }
  };

  getById = async (id) => {
    try {
      return await Chapter.findById(id).populate("accountId");
    } catch (error) {
      return "Có lỗi xảy ra khi lấy thông tin chi đoàn";
    }
  };

  update = async (id, input) => {
    try {
      const currentChapter = await Chapter.findById(id).populate("accountId");
      if (!currentChapter) return "Chi đoàn không tồn tại";

      const {
        username,
        email,
        phoneNumber,
        password,
        name,
        establishedAt,
        affiliated,
        address,
        status,
        avatar, // 👈 từ req.file gán ở controller
      } = input;

      console.log("📩 input update:", input);

      let avatarData = currentChapter.accountId.avatar;

      // ✅ Có avatar mới → xử lý upload
      if (avatar.path) {
        // ✅ Xoá ảnh cũ nếu có
        if (avatarData?.publicId) {
          await cloudinary.uploader.destroy(avatarData.publicId);
        }

        avatarData = {
          path: avatar.path,
          publicId: avatar.filename,
        };
      }

      // ✅ Validate trùng account
      const hasDuplicatedAccount = await validatorHelper.checkIsDuplicated(
        Account,
        [
          { key: "username", value: username },
          { key: "email", value: email },
          { key: "phoneNumber", value: phoneNumber },
        ],
        currentChapter.accountId
      );

      if (hasDuplicatedAccount)
        return "Tên đăng nhập, email hoặc số điện thoại đã được đăng ký";

      // ✅ Update tài khoản
      await Account.findByIdAndUpdate(currentChapter.accountId, {
        username,
        email,
        password,
        phoneNumber,
        status, // 👈 thêm hỗ trợ khóa / kích hoạt
        avatar: avatarData, // ✅ cập nhật avatar mới
      });

      // ✅ Update chapter
      await Chapter.findByIdAndUpdate(id, {
        name,
        affiliated,
        address,
        establishedAt,
      });

      // ✅ Trả kết quả cập nhật mới nhất
      return await Chapter.findById(id).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Có lỗi xảy ra khi cập nhật chi đoàn";
    }
  };

  activate = async (id) => {
    try {
      const currentChapter = await Chapter.findById(id).populate("accountId");
      if (!currentChapter) return "Chi đoàn không tồn tại";
      // ✅ Update tài khoản
      await Account.findByIdAndUpdate(currentChapter.accountId, {
        status: "active",
      });

      // ✅ Trả kết quả cập nhật mới nhất
      return await Chapter.findById(id).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Có lỗi xảy ra khi kích hoạt chi đoàn";
    }
  };

  lock = async (id) => {
    try {
      const currentChapter = await Chapter.findById(id).populate("accountId");
      if (!currentChapter) return "Chi đoàn không tồn tại";
      // ✅ Update tài khoản
      await Account.findByIdAndUpdate(currentChapter.accountId, {
        status: "locked",
      });

      // ✅ Trả kết quả cập nhật mới nhất
      return await Chapter.findById(id).populate("accountId");
    } catch (error) {
      console.log(error);
      return "Có lỗi xảy ra khi khóa chi đoàn";
    }
  };
}

export default new ChapterService();
