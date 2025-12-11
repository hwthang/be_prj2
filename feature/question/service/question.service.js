import Question from "../model/question.model.js";

class QuestionService {
  createNewQuestion = async (data) => {
    const newQuestion = new Question({ ...data });
    await newQuestion.save();

    return newQuestion;
  };

  updateQuestionById = async (id, data) => {
    return await Question.findByIdAndUpdate(id, { ...data }, { new: true });
  };
}
export default new QuestionService();
