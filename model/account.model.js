import { model, Schema } from "mongoose";

const AccountSchema = new Schema(
  {
    username: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    password: { type: String, default: null },
    role: { type: String, default: null, enum: ["admin", "manager", "member", ""] },
    status: {
      type: String,
      default: null,
      enum: ["active", "locked", "pending", ""],
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo model
const Account = model("Account", AccountSchema);

export default Account;
