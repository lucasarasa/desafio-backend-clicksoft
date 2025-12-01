import EventRepository from '../../repositories/event/EventRepository.js'
import OrganizerRepository from '../../repositories/organizer/OrganizerRepository.js'

export default class GetEventParticipantsUseCase {
  constructor(
    private eventRepository: EventRepository,
    private organizerRepository: OrganizerRepository
  ) {}

  async execute(userId: number, eventId: number) {
    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    const organizer = await this.organizerRepository.findByUserId(userId)
    if (!organizer) {
      throw new Error('Organizer not found')
    }

    if (event.organizer_id !== organizer.id) {
      throw new Error('You can only view participants of your own events')
    }

    const participants = await this.eventRepository.getParticipants(eventId)
    return participants
  }
}
