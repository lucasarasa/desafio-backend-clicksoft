import EventRepository from '../../repositories/event/EventRepository.js'
import OrganizerRepository from '../../repositories/organizer/OrganizerRepository.js'
import type { CreateEventDto } from '../../dtos/event/CreateEventDto.js'

export default class CreateEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private organizerRepository: OrganizerRepository
  ) {}

  async execute(userId: number, data: CreateEventDto) {
    if (!data.name || !data.date_hour || !data.localization || !data.capacity_max) {
      throw new Error('Missing required fields: name, date_hour, localization, capacity_max')
    }

    if (data.capacity_max <= 0) {
      throw new Error('Capacity must be greater than zero')
    }

    const organizer = await this.organizerRepository.findByUserId(userId)
    if (!organizer) {
      throw new Error('Organizer not found')
    }

    const existingEvent = await this.eventRepository.findByOrganizerAndDateTime(
      organizer.id,
      data.date_hour
    )
    if (existingEvent) {
      throw new Error('Você já possui um evento cadastrado neste horário')
    }

    const event = await this.eventRepository.create({
      ...data,
      organizer_id: organizer.id,
    })

    return event
  }
}
