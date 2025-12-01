import ParticipantRepository from '../../repositories/participant/ParticipantRepository.js'

export default class CancelEnrollmentUseCase {
  constructor(private participantRepository: ParticipantRepository) {}

  async execute(userId: number, eventId: number): Promise<void> {
    const participant = await this.participantRepository.findByUserId(userId)

    if (!participant) {
      throw new Error('Participant not found')
    }

    await participant.related('eventos').detach([eventId])
  }
}
