import { model, Schema } from "mongoose";

const SurveySchema = new Schema(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", default: null },
    name: { type: String, default: null },
    scope: { type: String, default: null },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    status: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Survey = model("Survey", SurveySchema);

export default Survey;
