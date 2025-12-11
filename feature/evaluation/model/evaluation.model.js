import mongoose, { Schema } from "mongoose";

const EvaluationSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", default: null },
    type: { type: Object, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    attachments: { type: [Object], default: null },
  },
  { timestamps: true }
);

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);

export default Evaluation;
