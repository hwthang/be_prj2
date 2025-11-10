import { model, Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    title: { type: String, default: null },
    content: { type: Object, default: null },
    seenId: { type: Schema.Types.ObjectId, ref: "Seen", default: null },
  },
  {
    timestamps: true,
  }
);

const Notification = model("Notification", NotificationSchema);

export default Notification;
