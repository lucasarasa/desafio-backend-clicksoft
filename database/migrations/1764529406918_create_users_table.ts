import { BaseSchema } from '@adonisjs/lucid/schema'
import { UserRole } from '../../app/utils/enums.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email').nullable().unique()
      table.string('password').notNullable()
      table.enu('role', Object.values(UserRole)).notNullable().defaultTo(UserRole.PARTICIPANT)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
