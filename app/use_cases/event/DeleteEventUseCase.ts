import EventRepository from '../../repositories/event/EventRepository.js'
import OrganizerRepository from '../../repositories/organizer/OrganizerRepository.js'

export default class DeleteEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private organizerRepository: OrganizerRepository
  ) {}

  async execute(userId: number, eventId: number): Promise<void> {
    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    const organizer = await this.organizerRepository.findByUserId(userId)
    if (!organizer) {
      throw new Error('Organizer not found')
    }

    if (event.organizer_id !== organizer.id) {
      throw new Error('You can only delete your own events')
    }

    const enrollmentCount = await this.eventRepository.getEnrollmentCount(eventId)
    if (enrollmentCount > 0) {
      throw new Error('Cannot delete event with enrolled participants')
    }

    await this.eventRepository.delete(eventId)
  }
}
