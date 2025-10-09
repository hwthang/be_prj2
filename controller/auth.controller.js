import authService from "../service/auth.service.js";
import userService from "../service/user.service.js";

class AuthController {

  login = async (req, res) => {
    const credentials = req.body;
    const result = await authService.login(credentials);
    res.send(result);
  };

  register = async (req, res) => {
    const input = req.body;
    const result = await authService.register(input);
    res.send(result);
  };
}

export default new AuthController();
