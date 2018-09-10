'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

Route.get('/', 'HomeController.index').as('welcomePage')

Route.get('/login', 'Auth/AuthController.showLogin').as('loginPage')
Route.post('/login', 'Auth/AuthController.postLogin').as('login.store')
Route.get('/logout', 'Auth/AuthController.logout').as('logout')

Route.get('/register', 'Auth/AuthController.showRegister').as('registerPage')
Route.post('/register', 'Auth/AuthController.postRegister').as('register.store')

Route.get('/password/reset', 'Auth/PasswordController.showResetForm').as('reset.form')
Route.post('/password/email', 'Auth/PasswordController.sendResetLinkEmail').as('send.reset.email')
Route.get('/password/token/reset/:token', 'Auth/PasswordController.showResetView')
Route.post('/password/reset', 'Auth/PasswordController.reset').as('reset.password')

Route.get('/contact', 'ContactController.index').as('contact.show')
Route.post('/contact', 'ContactController.sendMessage').as('contact.send')

/**
 * Social Login Route
 */
Route.get('/auth/:provider', 'Auth/AuthController.redirectToProvider').as('social.login')
Route.get('/auth/:provider/callback', 'Auth/AuthController.handleProviderCallback').as('social.login.callback')


Route.group(() => {
    Route.get('/account', 'AccountController.edit').as('user.account')
    Route.post('/account/profile', 'AccountController.update').as('account.update')
    Route.post('/account/photo', 'AccountController.uploadAvatar').as('account.updateAvatar')
    Route.post('/account/password', 'AccountController.changePassword').as('account.updatePwd')
    Route.get('/account/unlink/:provider', 'AccountController.unlinkSocialMediaAccount').as('unlink.sm')
    Route.get('/account/delete', 'AccountController.destroy').as('account.delete')
  
    Route.get('/api/github', 'GithubController.index').as('api.github')
    Route.get('/api/twitter', 'TwitterController.index').as('api.twitter')
    Route.post('/api/twitter/send', 'TwitterController.sendTweet').as('api.twitter.send')
    Route.get('/api/facebook', 'FacebookController.index').as('api.facebook')
    Route.get('/api/upload', 'UploadController.index').as('api.upload')
    Route.post('/api/upload/apply', 'UploadController.upload').as('api.uploadfile')
  })
  
  Route.get('/api', async ({ view }) => view.render('api'))
  

//Questions Routes
Route.group(() => {
    Route.get('/questions', 'QuestionController.index').as('questions')
    Route.get('/questions/ask', 'QuestionController.ask').as('questions.ask')
    Route.post('/questions/post', 'QuestionController.post').as('questions.post')
    Route.get('/question/delete-confirm/:id', 'QuestionController.confirmDelete').as('questions.delete0')
    Route.get('/question/delete/:id', 'QuestionController.delete').as('questions.delete')
    Route.get('/question/:id/:slug?', 'QuestionController.view').as('questions.view')

    Route.post('/questions/:id/answer/post', 'QuestionController.postAnswer').as('questions.answer.post')
  }).middleware(['auth']);