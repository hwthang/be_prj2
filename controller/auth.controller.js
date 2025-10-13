import authService from "../service/auth.service.js";
import chapterService from "../service/chapter.service.js";
import ResponseBuilder from "../utils/response.helper.js";

class AuthController {
  getChapters = async (req, res) => {
    const chapters = await chapterService.getAllChapters();
    const result = ResponseBuilder.success();
    result.data = chapters;
    result.send(res);
    return;
  };

  login = async (req, res) => {
    const credentials = req.body;
    const result = await authService.login(credentials);
    result.send(res);
    return;
  };

  register = async (req, res) => {
    const input = req.body;
    console.log(input);
    const result = await authService.register(input);
    result.send(res);
    return;
  };
}

export default new AuthController();
