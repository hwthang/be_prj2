import { model, Schema, SchemaType } from "mongoose";

const ChapterSchema = new Schema({
  chapterCode: { type: String, default: null }, //Khóa chính
  name: { type: String, default: null },
  affiliated: { type: String, default: null },
  office: { type: String, default: null },
  status: { type: String, default: null },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    default: null,
  },
});

const Chapter = model("Chapter", ChapterSchema);

export default Chapter;
