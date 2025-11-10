// controllers/AccountController.js

import accountService from "../service/account.service.js";

class AccountController {
  async create(req, res) {
    try {
      const duplicate = await accountService.isDuplicate(req.body);
      if (duplicate) {
        return res.status(400).json({
          message: "Tài khoản đã tồn tại!",
        });
      }
      if (req.file) req.body.avatar = req.file;
      const account = await accountService.createAccount(req.body);
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const accounts = await accountService.getAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const account = await accountService.getAccountById(req.params.id);
      if (!account) return res.status(404).json({ message: "Not found" });
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const duplicate = await accountService.isDuplicate(
        req.body,
        req.params.id
      );
      if (duplicate) {
        return res.status(400).json({
          message: "Thông tin bị trùng với tài khoản khác!",
        });
      }
      if (req.file) req.body.avatar = req.file;
      const account = await accountService.updateAccount(
        req.params.id,
        req.body
      );
      if (!account) return res.status(404).json({ message: "Not found" });
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async activate(req, res) {
    try {
      const result = await accountService.activateAccount(req.params.id);
      if (!result) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Activate successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

    async lock(req, res) {
    try {
      const result = await accountService.lockAccount(req.params.id);
      if (!result) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Lock successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await accountService.deleteAccount(req.params.id);
      if (!result) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AccountController();
