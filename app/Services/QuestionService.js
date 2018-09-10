'use strict'

const Question = use('App/Models/Question');
const Answer = use('App/Models/Answer');
const Database = use('Database');


class QuestionService {
    async ask (loginID, question) {
        const quest = new Question();

        quest.title = question.title;
        quest.body = question.body;
        quest.user_id = loginID.id;

        await quest.save();

        return quest
    }

    async answer (id, loginID, ans) {

        const quest = await Question.find(id);

        if (quest) {

            const answer = new Answer();
            answer.user_id = loginID.id;
            answer.question_id = quest.id;
            answer.answer = ans.answer;

            await answer.save();

            return answer
        }

        return false
    }

    async incrementQuestionView (questionId) {

        const question = await Question.find(questionId);
        question.views = question.views + 1;
        await question.save();

    }

    async delete (loginID, questionId) {

        const question = await Question.find(questionId);
        if (loginID.id ===  question.user_id){
            const del = await question.delete();
            return true;
        } else {
            return false
        }
    }
}

module.exports = QuestionService
