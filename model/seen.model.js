import { model, Schema } from "mongoose";

const SeenSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    type: { type: String, default: null },
    isSeen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Seen = model("Seen", SeenSchema);

export default Seen;
