import chapterService from "../service/chapter.service.js";
import userService from "../service/user.service.js";

class UserController {
  getUsers = async (req, res) => {
    const options = req.query;
    const user = req.user;
    console.log(user);

    let result = [];

    if (user.role == "admin")
      result = await userService.getUsersForAdmin(options);
    if (user.role == "manager") {
      const chapter = await chapterService.getChapterWithKey({
        managerId: user.id,
      });

      console.log(chapter);
      result = await userService.getUsersForManager(
        chapter.chapterCode,
        options
      );
    }

    res.send(result);
  };

  getUserWithUsername = async (req, res) => {
    const username = req.params.username;
    const user = req.user;

    if (user.username != username && !["admin", "manager"].includes(user.role))
      res.send("Bạn không có quyền truy cập");

    const result = await userService.getUserWithKey({ username: username });
    res.send(result);
  };

  createNewUser = async (req, res) => {
    const { role, input } = req.body;
    console.log(req.body);
    switch (role) {
      case "admin": {
        const result = await userService.createNewAdmin(input);
        res.send(result);
      }
      case "manager": {
        const result = await userService.createNewManager(input);
        res.send(result);
      }
      case "member": {
        const result = await userService.createNewMember(input);
        res.send(result);
      }
    }
  };

  updateUserWithUsername = async (req, res) => {
    const updatingUser = await userService.getUserWithKey({
      username: req.params.username,
    });

    const input = req.body;

    if (
      req.user.username != updatingUser.username &&
      !["admin", "manager"].includes(req.user.role)
    ) {
      res.send("Bạn không có quyền truy cập");
    }

    const role = updatingUser.role;
    switch (role) {
      case "admin": {
        const result = await userService.updateAdmin(updatingUser.id, input);
        res.send(result);
        return;
      }
      case "manager": {
        const result = await userService.updateManager(updatingUser.id, input);
        res.send(result);
        return;
      }
      case "member": {
        const result = await userService.updateMember(updatingUser.id, input);
        res.send(result);
        return;
      }
    }
  };

  activeUserWithUsename = async (req, res) => {
    const username = req.params.username;
    const result = await userService.activeUser({ username: username });
    res.send(result);
    return;
  };

  lockUserWithUsername = async (req, res) => {
    const username = req.params.username;
    const result = await userService.lockUser({ username: username });
    res.send(result);
    return;
  };
}

export default new UserController();
