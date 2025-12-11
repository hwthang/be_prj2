import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    question: {
      type: String,
      default: null,
    },
    options: {
      type: [String],
      default: null,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
