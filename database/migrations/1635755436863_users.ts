import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('email').notNullable().unique()
      table.string('name').notNullable()
      table.string('password').notNullable()
      table.string('reset_question').notNullable()
      table.string('reset_answer').notNullable()
      table.string('remember_me_token').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
