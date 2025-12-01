import EventRepository from '../../repositories/event/EventRepository.js'
import OrganizerRepository from '../../repositories/organizer/OrganizerRepository.js'
import type { UpdateEventDto } from '../../dtos/event/UpdateEventDto.js'

export default class UpdateEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private organizerRepository: OrganizerRepository
  ) {}

  async execute(userId: number, eventId: number, data: UpdateEventDto) {
    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    const organizer = await this.organizerRepository.findByUserId(userId)
    if (!organizer) {
      throw new Error('Organizer not found')
    }

    if (event.organizer_id !== organizer.id) {
      throw new Error('You can only edit your own events')
    }

    if (data.capacity_max !== undefined && data.capacity_max <= 0) {
      throw new Error('Capacity must be greater than zero')
    }

    const updatedEvent = await this.eventRepository.update(eventId, data)
    return updatedEvent
  }
}
