'use strict'

const Model = use('Model')

class Answer extends Model {
    question () {
        return this.belongsTo('App/Models/Question')
    }

    user () {
        return this.hasOne('App/Models/User','user_id', 'id')
    }
}

module.exports = Answer
