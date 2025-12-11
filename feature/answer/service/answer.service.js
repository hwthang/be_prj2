import Answer from "../model/answer.model.js";

class AnswerService {
  createNewAnswer = async (data) => {
    const newAnswer = new Answer({ ...data });
    await newAnswer.save();

    return await Answer.findById(newAnswer.id);
  };
}

export default new AnswerService();
