import User from '#models/user'
import Participant from '#models/participants'
import Organizer from '#models/organizer'
import { CreateUserDto } from '../../dtos/auth/CreateUserDto.js'

export default class UserRepository {
  async create(data: CreateUserDto) {
    return await User.create(data)
  }

  async findByEmail(email: string) {
    const normalized = email?.trim().toLowerCase()

    const participant = await Participant.query().where('email', normalized).preload('user').first()
    if (participant) return participant.user

    const organizer = await Organizer.query().where('email', normalized).preload('user').first()
    if (organizer) return organizer.user

    const user = await User.query().where('email', normalized).first()
    if (user) return user

    return null
  }

  async findById(id: number) {
    return User.find(id)
  }

  async updatePassword(id: number, hashedPassword: string) {
    const user = await User.find(id)
    if (!user) return null
    user.password = hashedPassword
    await user.save()
    return user
  }
}
