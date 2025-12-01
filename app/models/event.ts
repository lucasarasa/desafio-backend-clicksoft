import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'

import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Participant from './participants.js'
import Organizer from './organizer.js'

export default class Event extends BaseModel {
  public static table = 'events'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare date_hour: string

  @column()
  declare localization: string

  @column()
  declare description: string

  @column()
  declare capacity_max: number

  @column()
  declare organizer_id: number

  @belongsTo(() => Organizer)
  declare organizer: BelongsTo<typeof Organizer>

  @manyToMany(() => Participant, {
    pivotTable: 'event_participants',
    localKey: 'id',
    pivotForeignKey: 'event_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'participant_id',
    pivotTimestamps: true,
  })
  declare participantes: ManyToMany<typeof Participant>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
