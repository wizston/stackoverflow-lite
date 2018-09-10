'use strict'

const Schema = use('Schema')

class CreateAnswersSchema extends Schema {
  up () {
    this.create('answers', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.integer('question_id').unsigned()
      table.text('answer', 'longtext')
      table.integer('votes').defaultTo(0)
      table.boolean('is_answer').defaultTo(false)
      table.timestamps()
      table.foreign('question_id').references('questions.id')
      table.foreign('user_id').references('users.id')
    })
  }

  down () {
    this.drop('answers')
  }
}

module.exports = CreateAnswersSchema
