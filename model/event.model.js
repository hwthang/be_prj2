import { model, Schema } from "mongoose";

const EventSchema = new Schema(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", default: null },
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    name: { type: String, default: null },
    scope: { type: String, default: null },
    status: { type: String, default: null },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    venue: { type: String, default: null },
    description: { type: String, default: null },
    images: { type: Array, default: null },
    checkInAt: { type: Date, default: null },
    checkInDuration: { type: Int32Array, default: null },
  },
  {
    timestamps: true,
  }
);

const Event = model("Event", EventSchema);

export default Event;
