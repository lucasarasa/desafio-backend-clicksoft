import ParticipantRepository from '../../repositories/participant/ParticipantRepository.js'
import UserRepository from '../../repositories/auth/UserRepository.js'
import Hash from '@adonisjs/core/services/hash'
import type { UpdateParticipantDto } from '../../dtos/participant/UpdateParticipantDto.js'

export default class UpdateParticipantUseCase {
  constructor(
    private participantRepo = new ParticipantRepository(),
    private userRepo = new UserRepository()
  ) {}

  async run(participantId: number, userId: number, dto: UpdateParticipantDto) {
    const participant = await this.participantRepo.findById(participantId)
    if (!participant) throw new Error('Participant not found')

    if (participant.userId !== userId) throw new Error('Not allowed')

    if (dto.password) {
      const hashed = await Hash.use('scrypt').make(dto.password)
      await this.userRepo.updatePassword(userId, hashed)
    }

    const updatable: any = {}
    if (dto.name !== undefined) updatable.name = dto.name
    if (dto.email !== undefined) updatable.email = dto.email

    const updated = await this.participantRepo.update(participant.id, updatable)
    return updated
  }
}
