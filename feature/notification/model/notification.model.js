import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    default: null
  },
  title: {
    type: String,
    default: null
  },
  content: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: "info" // info, warning, success, error
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;