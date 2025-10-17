import Account from "../model/account.model.js";
import Profile from "../model/profile.model.js";
import bcryptHelper from "../utils/bcrypt.helper.js";
import validatorHelper from "../utils/validator.helper.js";

class UserService {
  // 🧩 Tạo người dùng mới
  createUser = async (input) => {
    try {
      const { account, profile } = input;

      if (
        await validatorHelper.checkDuplicatedKey(
          Account,
          "username",
          account?.username
        )
      )
        return "Tên người dùng đã được sử dụng";

      if (
        await validatorHelper.checkDuplicatedKey(
          Account,
          "email",
          account?.email
        )
      )
        return "Email đã được sử dụng";

      if (
        await validatorHelper.checkDuplicatedKey(
          Account,
          "phone",
          account?.phone
        )
      )
        return "Số điện thoại đã được sử dụng";

      // 🔹 Khởi tạo tài khoản
      const newAccount = new Account(account);
      newAccount.password = await bcryptHelper.hashPassword(account.password);
      console.log(input);

      // 🔹 Nếu có thông tin hồ sơ thì tạo profile và liên kết

      const newProfile = profile ? new Profile(profile) : new Profile();
      newAccount.profile = newProfile.id;
      await newProfile.save();

      // 🔹 Lưu tài khoản
      await newAccount.save();

      // 🔹 Populate lại để trả về dữ liệu đầy đủ
      const newUser = await Account.findOne({ _id: newAccount.id });

      console.log(newUser);

      return newUser;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi tạo người dùng";
    }
  };

  // 🧩 Lấy danh sách người dùng
  getUsers = async () => {
    try {
      const accounts = await Account.find().populate("profile");

      const users = accounts.map((item) => ({
        id: item.id,
        avatar: item.profile?.avatar?.path,
        fullname: item.profile?.fullname || "Chưa có",
        username: item.username,
        role: item.role,
        status: item.status,
      }));

      return users;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi lấy danh sách tài khoản";
    }
  };

  // 🧩 Lấy thông tin người dùng chi tiết
  getUser = async (id) => {
    try {
      const account = await Account.findOne({ _id: id }).populate({
        path: "profile", // populate field 'profile' trong Account
        populate: {
          path: "chapter", // populate field 'chapter' trong Profile
        },
      });
      return account;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi lấy thông tin tài khoản";
    }
  };

  // 🧩 Cập nhật người dùng
  updateUser = async (id, input) => {
    try {
      console.log(input);
      if (
        await validatorHelper.checkDuplicatedKey(
          Account,
          "username",
          input?.account?.username
        )
      )
        return "Tên người dùng đã được sử dụng";

      if (
        await validatorHelper.checkDuplicatedKey(
          Account,
          "email",
          input?.account?.email
        )
      )
        return "Email đã được sử dụng";

      if (
        await validatorHelper.checkDuplicatedKey(
          Account,
          "phone",
          input?.account?.phone
        )
      )
        return "Số điện thoại đã được sử dụng";

      // 🔹 Cập nhật thông tin tài khoản
      const account = await Account.findOne({ _id: id });
      Object.entries(input.account).forEach(([key, value]) => {
        if (value) account[key] = value;
      });

      // 🔹 Cập nhật thông tin hồ sơ nếu có
      if (input?.profile) {
        const profile = await Profile.findOne({ _id: account.profile });

        Object.entries(input.profile).forEach(([key, value]) => {
          if (value) profile[key] = value;
        });
        console.log(profile);
        await profile.save();
      }

      // 🔹 Lưu thay đổi tài khoản
      await account.save();

      // 🔹 Trả về dữ liệu cập nhật mới nhất
      const updatedUser = await Account.findOne({
        _id: account.id,
      }).populate("profile");

      return updatedUser;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi cập nhật tài khoản";
    }
  };

  // 🧩 Kích hoạt người dùng
  activeUser = async (id) => {
    try {
      const account = await Account.findOne({ _id: id });
      account.status = "active";

      const activeAccount = await account.save();
      return activeAccount;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi kích hoạt tài khoản";
    }
  };

  // 🧩 Khóa người dùng
  lockUser = async (id) => {
    try {
      const account = await Account.findOne({ _id: id });
      account.status = "locked";

      const lockedAccount = await account.save();
      return lockedAccount;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi khóa tài khoản";
    }
  };

  updateAvatar = async (id, avatar) => {
    try {
      const account = await Account.findOne({ _id: id });
      console.log(account);
      const profile = await Profile.findOne({ _id: account?.profile });
      console.log(profile);
      profile.avatar = avatar;

      await profile.save();
      const newProfile = await Profile.findOne({ _id: account.profile });

      return newProfile.avatar;
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi cập nhật ảnh đại diện";
    }
  };
}

export default new UserService();
