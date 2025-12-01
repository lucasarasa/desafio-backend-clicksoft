import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('participant_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('participants')
        .onDelete('SET NULL')
      table
        .integer('organizer_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('organizers')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('participant_id')
      table.dropColumn('organizer_id')
    })
  }
}
