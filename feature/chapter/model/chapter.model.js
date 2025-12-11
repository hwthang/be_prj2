import { model, Schema, SchemaType } from "mongoose";

const ChapterSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    name: { type: String, default: null },
    affiliated: { type: String, default: null },
    establishedAt: { type: Date, default: null },
    address: { type: String, default: null },
  },
  { timestamps: true }
);

const Chapter = model("Chapter", ChapterSchema);

export default Chapter;
