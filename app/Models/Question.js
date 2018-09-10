'use strict'

const Model = use('Model')
const slugify = require('@sindresorhus/slugify');

class Question extends Model {
    static boot () {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (userInstance) => {
            userInstance.slug = await slugify(userInstance.title)
        })
    }
    static castDates (field, value) {
        // if (field === 'dob') {
            return `${value.fromNow(true)} ago`
        // }
        return super.formatDates(field, value)
    }

  user () {
    return this.hasOne('App/Models/User','user_id', 'id')
  }

  answers () {
    return this.hasMany('App/Models/Answer','id', 'question_id')
  }
}

module.exports = Question
