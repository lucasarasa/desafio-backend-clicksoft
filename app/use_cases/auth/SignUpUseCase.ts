import { SignUpDto } from '../../dtos/auth/SignUpDto.js'
import UserRepository from '../../repositories/auth/UserRepository.js'
import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import ParticipantRepository from '../../repositories/participant/ParticipantRepository.js'
import OrganizerRepository from '../../repositories/organizer/OrganizerRepository.js'
import { CreateUserDto } from '../../dtos/auth/CreateUserDto.js'
import { signUpValidator } from '#validators/auth/auth_validator'

export default class SignUpUseCase {
  constructor(
    private userRepo = new UserRepository(),
    private participantRepo = new ParticipantRepository(),
    private organizerRepo = new OrganizerRepository()
  ) {}

  async run(dto: SignUpDto) {
    try {
      await signUpValidator.validate(dto)
    } catch (error: any) {
      if (error.messages?.cpf) {
        throw new Error('O CPF deve ter exatamente 11 dígitos sem pontos ou traços')
      }
      throw error
    }

    const existingUser = await this.userRepo.findByEmail(dto.email.trim().toLowerCase())
    if (existingUser) throw new Error('Email já cadastrado')

    if (dto.role === 'participant' && dto.cpf) {
      const existingCpf = await this.participantRepo.findByCpf(dto.cpf)
      if (existingCpf) throw new Error('CPF já cadastrado')
    }

    const hashedPassword = await Hash.use('scrypt').make(dto.password)
    const userDto: CreateUserDto = {
      password: hashedPassword,
      role: dto.role,
      email: dto.email.trim().toLowerCase(),
    }
    const user = await this.userRepo.create(userDto)

    if (dto.role === 'participant') {
      const participant = await this.participantRepo.create({
        userId: user.id,
        name: dto.name,
        email: dto.email.trim().toLowerCase(),
        cpf: dto.cpf,
      })
      await User.query().where('id', user.id).update({ participantId: participant.id })
      user.participantId = participant.id
    }

    if (dto.role === 'organizer') {
      const organizer = await this.organizerRepo.create({
        userId: user.id,
        name: dto.name,
        email: dto.email.trim().toLowerCase(),
        cpf: dto.cpf,
      })
      await User.query().where('id', user.id).update({ organizerId: organizer.id })
      user.organizerId = organizer.id
    }

    const { password, ...safeUser } = user.toJSON()
    const tokenInstance = await User.accessTokens.create(user, ['*'], {
      name: dto.name || 'signup',
      expiresIn: '2h',
    })
    const plainToken = tokenInstance.toJSON().token

    return { user: safeUser, token: plainToken }
  }
}
