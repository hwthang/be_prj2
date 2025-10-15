import { model, Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    avatar: { type: Object, default: null },
    fullname: { type: String, default: null },
    birthdate: { type: Date, default: null },
    gender: { type: String, default: null, enum: ["male", "female", ""] },
    address: { type: String, default: null },
    cardCode: { type: String, default: null },
    joinedDate: { type: Date, default: null },
    position: {
      type: String,
      default: null,
      enum: ["bt", "pbt", "uv", "dv", ""],
    },
    chapter: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo model
const Profile = model("Profile", ProfileSchema);

export default Profile;
