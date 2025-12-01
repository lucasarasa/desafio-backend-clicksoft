import type { HttpContext } from '@adonisjs/core/http'
import EventRepository from '../../repositories/event/EventRepository.js'
import OrganizerRepository from '../../repositories/organizer/OrganizerRepository.js'
import CreateEventUseCase from '../../use_cases/event/CreateEventUseCase.js'
import UpdateEventUseCase from '../../use_cases/event/UpdateEventUseCase.js'
import DeleteEventUseCase from '../../use_cases/event/DeleteEventUseCase.js'
import GetEventParticipantsUseCase from '../../use_cases/event/GetEventParticipantsUseCase.js'
import type { CreateEventDto } from '../../dtos/event/CreateEventDto.js'
import type { UpdateEventDto } from '../../dtos/event/UpdateEventDto.js'

export default class OrganizerController {
  private eventRepo = new EventRepository()
  private organizerRepo = new OrganizerRepository()
  private createEventUseCase = new CreateEventUseCase(this.eventRepo, this.organizerRepo)
  private updateEventUseCase = new UpdateEventUseCase(this.eventRepo, this.organizerRepo)
  private deleteEventUseCase = new DeleteEventUseCase(this.eventRepo, this.organizerRepo)
  private getParticipantsUseCase = new GetEventParticipantsUseCase(
    this.eventRepo,
    this.organizerRepo
  )

  public async createEvent({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const payload: CreateEventDto = request.only([
        'name',
        'date_hour',
        'localization',
        'description',
        'capacity_max',
      ])

      const event = await this.createEventUseCase.execute(user.id, payload)

      return response.created({ event })
    } catch (error: any) {
      if (error.message === 'Organizer not found')
        return response.notFound({ message: 'Organizador não encontrado' })
      if (error.message.includes('Missing required fields'))
        return response.badRequest({
          message: 'Campos obrigatórios ausentes: nome, data/hora, localização, capacidade máxima',
        })
      if (error.message === 'Capacity must be greater than zero')
        return response.badRequest({ message: 'Capacidade deve ser maior que zero' })

      return response.status(400).send({ message: error.message || 'Erro ao criar evento' })
    }
  }

  public async updateEvent({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const eventId = params.id
      if (!eventId) return response.badRequest({ message: 'ID do evento é obrigatório' })

      const payload: UpdateEventDto = request.only([
        'name',
        'date_hour',
        'localization',
        'description',
        'capacity_max',
      ])

      if (Object.keys(payload).length === 0) {
        return response.badRequest({ message: 'Nenhum campo para atualizar' })
      }

      const event = await this.updateEventUseCase.execute(user.id, Number(eventId), payload)

      return response.ok({ event })
    } catch (error: any) {
      if (error.message === 'Event not found')
        return response.notFound({ message: 'Evento não encontrado' })
      if (error.message === 'Organizer not found')
        return response.notFound({ message: 'Organizador não encontrado' })
      if (error.message === 'You can only edit your own events')
        return response.forbidden({ message: 'Você só pode editar seus próprios eventos' })
      if (error.message === 'Capacity must be greater than zero')
        return response.badRequest({ message: 'Capacidade deve ser maior que zero' })
      if (error.message === 'Cannot update event with enrolled participants')
        return response.conflict({
          message: 'Não é possível atualizar evento com participantes inscritos',
        })

      return response.status(400).send({ message: error.message || 'Erro ao atualizar evento' })
    }
  }

  public async deleteEvent({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const eventId = params.id
      if (!eventId) return response.badRequest({ message: 'ID do evento é obrigatório' })

      await this.deleteEventUseCase.execute(user.id, Number(eventId))

      return response.ok({ message: 'Evento deletado com sucesso' })
    } catch (error: any) {
      if (error.message === 'Event not found')
        return response.notFound({ message: 'Evento não encontrado' })
      if (error.message === 'Organizer not found')
        return response.notFound({ message: 'Organizador não encontrado' })
      if (error.message === 'You can only delete your own events')
        return response.forbidden({ message: 'Você só pode deletar seus próprios eventos' })
      if (error.message === 'Cannot delete event with enrolled participants')
        return response.conflict({
          message: 'Não é possível deletar evento com participantes inscritos',
        })

      return response.status(400).send({ message: error.message || 'Erro ao deletar evento' })
    }
  }

  public async getEventParticipants({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const eventId = params.id
      if (!eventId) return response.badRequest({ message: 'ID do evento é obrigatório' })

      const participants = await this.getParticipantsUseCase.execute(user.id, Number(eventId))

      return response.ok({ participants })
    } catch (error: any) {
      if (error.message === 'Event not found')
        return response.notFound({ message: 'Evento não encontrado' })
      if (error.message === 'Organizer not found')
        return response.notFound({ message: 'Organizador não encontrado' })
      if (error.message === 'You can only view participants of your own events')
        return response.forbidden({
          message: 'Você só pode visualizar participantes dos seus próprios eventos',
        })

      return response.status(400).send({ message: error.message || 'Erro ao buscar participantes' })
    }
  }
}
