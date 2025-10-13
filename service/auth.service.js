import bcryptHelper from "../utils/bcrypt.helper.js";
import jwtHelper from "../utils/jwt.helper.js";
import ResponseBuilder from "../utils/response.helper.js";
import userService from "./user.service.js";

class AuthService {
  login = async (credentials) => {
    const { username, email, phone, password } = credentials;

    const conditions = [];

    if (username) conditions.push({ username });
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    const user = await userService.getUserWithKey({
      $or: conditions,
    });

    console.log(user);

    if (!user) return ResponseBuilder.error("Không tìm thấy người dùng");

    const isMatch = await bcryptHelper.comparePassword(password, user.password);

    if (!isMatch) return ResponseBuilder.error("Tài khoản hoặc mật khẩu không khớp");

    const token = jwtHelper.signToken({ id: user.id });

    const result = ResponseBuilder.success("Đăng nhập thành công");
    result.data = { token, role: user.role };

    return result;
  };

  register = async (input) => {
    const result = await userService.createNewMember(input);

    return result;
  };
}

export default new AuthService();
