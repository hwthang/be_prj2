// services/AccountService.js

import Account from "../model/account.model.js";
import Chapter from "../model/chapter.model.js";
import Member from "../model/member.model.js";

class AccountService {
  async isDuplicate({ username, email, phoneNumber }, excludeId = null) {
    const query = {
      $or: [
        username ? { username } : null,
        email ? { email } : null,
        phoneNumber ? { phoneNumber } : null,
      ].filter(Boolean),
    };

    if (excludeId) query._id = { $ne: excludeId };

    return await Account.findOne(query);
  }

  async createAccount(data) {
    const account = await Account.create(data);
    if (data.type == "chapter") {
      const chapter = new Chapter({
        accountId: account._id,
      });
      await chapter.save();
      return { ...account.toObject(), chapterId: chapter.id };
    }
    if (data.type == "member") {
      const member = new Member({
        accountId: account._id,
      });
      await member.save();
      return { ...account.toObject(), memberId: member.id };
    }
    return { ...account.toObject() };
  }

  async getAccounts() {
    return await Account.find();
  }

  async getAccountById(id) {
    return await Account.findById(id);
  }

  async updateAccount(id, data) {
    return await Account.findByIdAndUpdate(id, data, { new: true });
  }

  async activateAccount(id) {
    return await Account.findByIdAndUpdate(
      id,
      { status: "active" },
      { new: true }
    );
  }

  async lockAccount(id) {
    return await Account.findByIdAndUpdate(
      id,
      { status: "locked" },
      { new: true }
    );
  }

  async deleteAccount(id) {
    return await Account.findByIdAndDelete(id);
  }
}

export default new AccountService();
