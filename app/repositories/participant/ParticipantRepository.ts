import Participant from '#models/participants'
import { CreateParticipantDto } from '../../dtos/participant/CreateParticipantDto.js'

export default class ParticipantRepository {
  async create(data: CreateParticipantDto) {
    return await Participant.create(data)
  }

  async findByCpf(cpf: string) {
    return Participant.query().where('cpf', cpf).first()
  }

  async findByUserId(userId: number) {
    return Participant.query().where('user_id', userId).first()
  }

  async findById(id: number) {
    return Participant.find(id)
  }

  async update(
    id: number,
    data: Partial<CreateParticipantDto & { name?: string; cpf?: string; email?: string }>
  ) {
    const participant = await Participant.find(id)
    if (!participant) return null
    participant.merge(data)
    await participant.save()
    return participant
  }

  async checkIfEnrolled(participantId: number, eventId: number): Promise<boolean> {
    const participant = await Participant.query()
      .where('id', participantId)
      .preload('eventos', (query) => {
        query.where('events.id', eventId)
      })
      .first()

    if (!participant) return false
    return participant.eventos.length > 0
  }

  async getEnrolledEventsWithDateTime(participantId: number) {
    const participant = await Participant.query()
      .where('id', participantId)
      .preload('eventos')
      .first()

    if (!participant) return []
    return participant.eventos
  }
}
