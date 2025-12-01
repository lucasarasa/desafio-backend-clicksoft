import ParticipantRepository from '../../repositories/participant/ParticipantRepository.js'
import EventRepository from '../../repositories/event/EventRepository.js'

export default class EnrollInEventUseCase {
  constructor(
    private participantRepository: ParticipantRepository,
    private eventRepository: EventRepository
  ) {}

  async execute(userId: number, eventId: number): Promise<void> {
    const participant = await this.participantRepository.findByUserId(userId)
    if (!participant) {
      throw new Error('Participant not found')
    }

    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    const alreadyEnrolled = await this.participantRepository.checkIfEnrolled(
      participant.id,
      eventId
    )
    if (alreadyEnrolled) {
      throw new Error('Already enrolled in this event')
    }

    const currentEnrollments = await this.eventRepository.getEnrollmentCount(eventId)
    if (currentEnrollments >= event.capacity_max) {
      throw new Error('Event is full')
    }

    const enrolledEvents = await this.participantRepository.getEnrolledEventsWithDateTime(
      participant.id
    )

    for (const enrolledEvent of enrolledEvents) {
      if (enrolledEvent.date_hour === event.date_hour) {
        throw new Error('Schedule conflict: you already have an event at this time')
      }
    }

    await participant.related('eventos').attach([eventId])
  }
}
