import jwtHelper from "../../../utils/jwt.helper.js";
import Account from "../model/account.model.js";

class AccountService {
  checkIsAccountExisted = async (
    account = { username: "", email: "", phoneNumber: "" },
    excludedId = null
  ) => {
    const queryExclude = excludedId ? { _id: { $ne: excludedId } } : {};

    if (await Account.findOne({ username: account.username, ...queryExclude }))
      return "Tên đăng nhập đã được sử dụng";

    if (await Account.findOne({ email: account.email, ...queryExclude }))
      return "Email đã được sử dụng";

    if (
      await Account.findOne({
        phoneNumber: account.phoneNumber,
        ...queryExclude,
      })
    )
      return "Số điện thoại đã được sử dụng";

    return false;
  };

  createAdmin = async (
    data = {
      username: "admin",
      password: "Admin@123",
      email: "admin.qldv@gmail.com",
      phoneNumber: "0987654321",
    }
  ) => {
    try {
      const isAccountExisted = await this.checkIsAccountExisted(data);

      if (typeof isAccountExisted == "string") return isAccountExisted;

      const newAdmin = new Account({
        ...data,
        displayName: "Quản trị viên",
        type: "admin",
      });

      await newAdmin.save();

      return newAdmin;
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo tài khoản quản trị viên";
    }
  };

  login = async (data = { account: "", password: "" }) => {
    try {
      const isAccountExisted = await this.checkIsAccountExisted({
        username: data.account,
        email: data.account,
        phoneNumber: data.account,
      });

      // Nếu không tìm thấy tài khoản → checkIsAccountExisted trả false
      if (!isAccountExisted) {
        return "Không tìm thấy tài khoản";
      }

      // Tìm tài khoản theo username/email/phone
      const account = await Account.findOne({
        $or: [
          { username: data.account },
          { email: data.account },
          { phoneNumber: data.account },
        ],
        password: data.password,
      });

      if (!account) return "Sai mật khẩu";

      return account; // hoặc JWT token tùy bạn
      // return jwtHelper.signToken(account);
    } catch (error) {
      console.log(error);
      return "Lỗi khi đăng nhập";
    }
  };

  activate = async (id) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
      );
      return updatedAccount;
    } catch (error) {
      console.log(error);
      return "Lỗi khi kích hoạt tài khoản";
    }
  };

  inactivate = async (id) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );
      return updatedAccount;
    } catch (error) {
      console.log(error);
      return "Lỗi khi hủy kích hoạt tài khoản";
    }
  };

  recoverPassword = async (id, data = { password: "" }) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        id,
        { password: data.password },
        { new: true }
      );
      return updatedAccount;
    } catch (error) {
      console.log(error);
      return "Lỗi khi hủy kích hoạt tài khoản";
    }
  };

  changeAvatar = async (id, avatar = {}) => {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        id,
        { avatar: avatar },
        { new: true }
      );
      return updatedAccount;
    } catch (error) {
      console.log(error);
      return "Lỗi khi hủy kích hoạt tài khoản";
    }
  };
}

export default new AccountService();
