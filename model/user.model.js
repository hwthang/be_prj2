import { model, Schema, SchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, default: null }, //Khóa chính
    email: { type: String, default: null },
    phone: { type: String, default: null },
    password: { type: String, default: null },
    role: { type: String, default: null },
    status: {
      type: String,
      default: "pending",
      enum: ["active", "locked", "pending"],
    },

    avatar: { type: Object, default: null },
    fullname: { type: String, default: null },
    birthdate: { type: Date, default: null },
    gender: { type: String, default: null },
    address: { type: String, default: null },
    cardCode: { type: String, default: null },
    joinedDate: { type: Date, default: null },
    position: { type: String, default: null },
    chapterCode: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Tạo model
const User = model("User", UserSchema);

export default User;
