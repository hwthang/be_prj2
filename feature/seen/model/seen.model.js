import mongoose from "mongoose";

const seenSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    default: null
  },
  type: {
    type: String,
    default: null // 'message' hoặc 'notification'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null // messageId hoặc notificationId
  },
  isSeen: {
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

// Index để tối ưu truy vấn
seenSchema.index({ accountId: 1, targetId: 1, type: 1 }, { unique: true });

const Seen = mongoose.model("Seen", seenSchema);
export default Seen;