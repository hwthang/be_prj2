import { model, Schema } from "mongoose";

const MemberSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", default: null },
    chapterId: { type: Schema.Types.ObjectId, ref: "Chapter", default: null },
    fullName: { type: String, default: null },
    gender: { type: String, default: null },// nam, nu
    dateOfBirth: { type: Date, default: null },
    hometown: { type: String, default: null },
    address: { type: String, default: null },
    ethnicity: { type: String, default: null },
    religion: { type: String, default: null },
    education: { type: String, default: null },
    qualification: { type: String, default: null },
    politicalTheory: { type: String, default: null },
    memberCode: { type: String, default: null },
    joinedAt: { type: Date, default: null },
    position: { type: String, default: null },
  },
  { timestamps: true }
);

const Member = model("Member", MemberSchema);

export default Member;
