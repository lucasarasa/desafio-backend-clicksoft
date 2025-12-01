import Event from '#models/event'
import type { CreateEventDto } from '../dtos/event/CreateEventDto.js'
import type { UpdateEventDto } from '../dtos/event/UpdateEventDto.js'

export default class EventRepository {
  async create(data: CreateEventDto & { organizer_id: number }): Promise<Event> {
    return await Event.create(data)
  }

  async findById(id: number): Promise<Event | null> {
    return await Event.find(id)
  }

  async update(id: number, data: UpdateEventDto): Promise<Event | null> {
    const event = await Event.find(id)
    if (!event) return null
    event.merge(data)
    await event.save()
    return event
  }

  async delete(id: number): Promise<void> {
    const event = await Event.find(id)
    if (event) {
      await event.delete()
    }
  }

  async getEnrollmentCount(eventId: number): Promise<number> {
    const event = await Event.query().where('id', eventId).preload('participantes').firstOrFail()
    return event.participantes.length
  }

  async getParticipants(eventId: number) {
    const event = await Event.query().where('id', eventId).preload('participantes').first()
    return event?.participantes || []
  }

  async findByOrganizerAndDateTime(organizerId: number, dateTime: string): Promise<Event | null> {
    return await Event.query()
      .where('organizer_id', organizerId)
      .where('date_hour', dateTime)
      .first()
  }
}
