import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    scope: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Survey = mongoose.model("Survey", surveySchema);
export default Survey;
