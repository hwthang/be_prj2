import { model, Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    avatar: { type: Object, default: null },
    displayName: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    username: { type: String, default: null },
    password: { type: String, default: null },
    type: { type: String, default: null }, //admin, chapter, member
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Account = model("Account", AccountSchema);
export default Account;
