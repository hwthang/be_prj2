import { model, Schema, SchemaType } from "mongoose";

const ChapterSchema = new Schema({
  name: { type: String, default: null },
  affiliated: { type: String, default: null },
  office: { type: String, default: null },
  status: { type: String, default: null, enum: ["active", "locked"] },
  manager: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    default: null,
  },
});

const Chapter = model("Chapter", ChapterSchema);

export default Chapter;
