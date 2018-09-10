'use strict'
const { validateAll } = use('Validator');

const Question = use('App/Models/Question');
const quest = make('App/Services/QuestionService');
const paginator = require('@pelevesque/paginate');

class QuestionController {
    async index ({ view, request, response }) {

        const currentPage = request.input('page') ? request.input('page') : 1;
        const perPage = 30;

        let questions = await Question.query().with('answers').with('user').paginate(currentPage, perPage);
        questions = questions.toJSON();
        const numLinks = 10;
        const url = request.url() + '?page=';
        const paginate = paginator(numLinks, currentPage, perPage, questions.total, url)


        // response.send(questions);
        return view.render('question.index', { questions: questions.data, paginate: paginate })

    }

    async view ({ view, params,response }) {

        //Increment Question View count
        await quest.incrementQuestionView(params.id);

        let question = await Question.query().with('answers.user').with('user').where('id', params.id).first();
        question = question.toJSON();

        // response.send(question);
        return view.render('question.view', { question: question})
    }

    async ask ({ view }) {
        return view.render('question.ask')
    }


    async post ({ request, session, response, auth}) {
        const newQuestion = request.only(['title', 'body'])
        const rules = {
            title: 'required|min:3',
            body: 'required|min:30'
        }

        const validation = await validateAll(newQuestion, rules)

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashAll()

            return response.redirect('back')
        }
        try {
            const loginID = await auth.getUser();
            const nuQuestion = await quest.ask(loginID, newQuestion);

            session.flash({ status: 'Your Question has been posted successfully' })
            return response.route('questions.view', {id: nuQuestion.id, slug: nuQuestion.slug});

        } catch (error) {
            session.flash({ error: 'You are not logged in' });
            response.route('loginPage');
        }
    }


    async postAnswer ({ request, session, response, auth, params}) {
        const newAnswer = request.only(['answer']);
        const rules = {
            answer: 'required|min:30'
        };

        const validation = await validateAll(newAnswer, rules);

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashAll();

            return response.redirect('back')
        }

        try {
            const loginID = await auth.getUser();
            await quest.answer(params.id, loginID, newAnswer);

            session.flash({ status: 'Thank you, Your answer has been submitted successfully' })
            return response.redirect('back')

        } catch (error) {
            session.flash({ error: 'Could not delete question, please try again later' });
            return response.redirect('back');
        }
    }

    async confirmDelete ({ view, params, auth, session, response }) {
        const loginID = await auth.user;
        const question = await Question.find(params.id);
        if (question && loginID.id === question.user_id) {
            const question = await Question.query().with('user').where("id", params.id).first();

            return view.render('question.confirmation', {question: question.toJSON()})
        } else {

            session.flash({ error: 'You can only delete questions created by you' });
            return response.route('questions');
        }
    }

    async delete ({ params, session, response, auth}) {

        try {
            const loginID = await auth.getUser();
            const del = await quest.delete(loginID, params.id);
            if (del) {
                session.flash({ status: 'Your question has been posted successfully' })
                return response.route('questions');
            } else {
                session.flash({ error: 'Could not delete question, please try again later' });
                return response.route('questions');
            }

        } catch (error) {
            response.send('An error occurred, please try again later')
        }
    }
}

module.exports = QuestionController
