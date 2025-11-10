import { model, Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: "Survey", default: null },
    type: { type: String, default: null },
    question: { type: String, default: null },
    options: { type: Array, default: null },
  },
  {
    timestamps: true,
  }
);

const Question = model("Question", QuestionSchema);

export default Question;
