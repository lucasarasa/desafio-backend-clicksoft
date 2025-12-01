import Organizer from '#models/organizer'
import { CreateOrganizerDto } from '../../dtos/organizer/CreateOrganizerDto.js'

export default class OrganizerRepository {
  async create(data: CreateOrganizerDto) {
    return await Organizer.create(data)
  }

  async findByUserId(userId: number) {
    return await Organizer.query().where('user_id', userId).first()
  }

  async findByCpf(cpf: string) {
    return Organizer.query().where('cpf', cpf).first()
  }

  async findById(id: number) {
    return await Organizer.find(id)
  }

  async findByEmail(email: string) {
    return await Organizer.query().where('email', email.trim().toLowerCase()).first()
  }
}
