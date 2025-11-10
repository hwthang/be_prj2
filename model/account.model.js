import { model, Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    avatar: { type: Object, default: null },
    username: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    password: { type: String, default: null },
    type: { type: String, default: null },
    status: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Account = model("Account", AccountSchema);

export default Account;
