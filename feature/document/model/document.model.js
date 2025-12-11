import { model, Schema } from "mongoose";

const DocumentSchema = new Schema(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", default: null },
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    name: { type: String, default: null },
    type: { type: String, default: null },
    scope: { type: String, default: null },
    docCode: { type: String, default: null },
    issuedAt: { type: Date, default: null },
    description: { type: String, default: null },
    file: { type: Object, default: null },
  },
  {
    timestamps: true,
  }
);

const Document = model("Document", DocumentSchema);

export default Document;
