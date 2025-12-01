import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
       table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('date_hour').notNullable()
      table.string('localization').notNullable()
      table.text('description').notNullable()
      table.integer('capacity_max').notNullable()
      table.integer('organizer_id').unsigned().notNullable().references('id').inTable('organizers').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}