import vine from '@vinejs/vine'
import { UserRole } from '../../utils/enums.js'

const signUpSchema = vine.object({
  name: vine.string().trim().minLength(3),
  email: vine.string().trim().email(),
  password: vine.string().trim().minLength(6),
  role: vine.enum([UserRole.PARTICIPANT, UserRole.ORGANIZER]),
  cpf: vine.string().trim().fixedLength(11).regex(/^\d+$/),
})

export const signUpValidator = vine.compile(signUpSchema)

export const signInValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6),
  })
)
