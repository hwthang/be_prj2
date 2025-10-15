import Account from "../model/account.model.js";
import bcryptHelper from "../utils/bcrypt.helper.js";
import jwtHelper from "../utils/jwt.helper.js";
import userService from "./user.service.js";

class AuthService {
  getNameOfKey = (key) => {
    try {
      if (key.includes("@")) return "email";
      if (/^\d+$/.test(key)) return "phone";
      return "username";
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi lấy thông tin khóa";
    }
  };

  login = async (input) => {
    try {
      const account = await Account.findOne({
        [this.getNameOfKey(input.key)]: input.key,
      });

      if (account == null) return "Không tìm thấy tài khoản";
      const isMatch = await bcryptHelper.comparePassword(
        input.password,
        account.password
      );

      if (!isMatch) return "Tài khoản hoặc mật khẩu không khớp";

      const token = jwtHelper.signToken({ id: account.id });
      return { token, role: account.role };
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi đăng nhập";
    }
  };

  register = async (input) => {
    try {
      console.log(input)

      const newMember = await userService.createUser(input);
      return newMember
    } catch (error) {
      console.log(error.message);
      return "Lỗi khi đăng ký người dùng";
    }
  };
}

export default new AuthService();
