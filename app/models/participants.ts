import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'

import User from './user.js'
import Event from './event.js'

import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Participant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare cpf: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Event, {
    pivotTable: 'event_participants',
    pivotForeignKey: 'participant_id',
    pivotRelatedForeignKey: 'event_id',
  })
  declare eventos: ManyToMany<typeof Event>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
