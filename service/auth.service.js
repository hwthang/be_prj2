import bcryptHelper from "../utils/bcrypt.helper.js";
import jwtHelper from "../utils/jwt.helper.js";
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

    if (!user) return "Sai tài khoản hoặc mật khẩu";

    const isMatch = await bcryptHelper.comparePassword(password, user.password);

    if (!isMatch) return "Sai tài khoản hoặc mật khẩu";

    const token = jwtHelper.signToken({ id: user.id });

    return token;
  };

  register = async (input) => {
    const result = userService.createNewMember(input);
    if (result.status == "pending") result.status = "active";
    return result;
  };
}

export default new AuthService();
