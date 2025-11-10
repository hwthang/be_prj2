import { model, Schema } from "mongoose";

const AnswerSchema = new Schema(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", default: null },
    memberId: { type: Schema.Types.ObjectId, ref: "Member", default: null },
    text: { type: String, default: null },
    options: { type: Array, default: null },
  },
  {
    timestamps: true,
  }
);

const Answer = model("Answer", AnswerSchema);

export default Answer;
