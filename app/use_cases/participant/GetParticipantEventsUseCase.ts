import ParticipantRepository from '../../repositories/participant/ParticipantRepository.js'

export default class GetParticipantEventsUseCase {
  constructor(private participantRepo = new ParticipantRepository()) {}

  async run(userId: number) {
    const participant = await this.participantRepo.findByUserId(userId)
    if (!participant) throw new Error('Participant not found')

    await participant.load('eventos')

    return participant.eventos
  }
}
