import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { UserRole } from '../utils/enums.js'
import Participant from './participants.js'
import Organizer from './organizer.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: UserRole

  @column()
  declare participantId: number | null

  @column()
  declare organizerId: number | null

  @hasOne(() => Participant, { foreignKey: 'user_id', localKey: 'id' })
  declare participant: HasOne<typeof Participant>

  @hasOne(() => Organizer, { foreignKey: 'user_id', localKey: 'id' })
  declare organizer: HasOne<typeof Organizer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
