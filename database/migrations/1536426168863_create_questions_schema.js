'use strict'

const Schema = use('Schema')

class CreateQuestionsSchema extends Schema {
  up () {
    this.create('questions', (table) => {
      table.increments()
      table.string('title').notNullable()
      table.text('body', 'longtext').notNullable()
      table.string('slug')
      table.integer('rating').defaultTo(0)
      table.integer('views').defaultTo(0)
      table.boolean('is_answered').defaultTo(false)
      table.integer('user_id').unsigned()
      table.timestamps()
      table.foreign('user_id').references('users.id')
    })
  }

  down () {
    this.drop('questions')
  }
}

module.exports = CreateQuestionsSchema
