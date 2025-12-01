import type { HttpContext } from '@adonisjs/core/http'
import ParticipantRepository from '../../repositories/participant/ParticipantRepository.js'
import EventRepository from '../../repositories/event/EventRepository.js'
import UpdateParticipantUseCase from '../../use_cases/participant/UpdateParticipantUseCase.js'
import GetParticipantEventsUseCase from '../../use_cases/participant/GetParticipantEventsUseCase.js'
import CancelEnrollmentUseCase from '../../use_cases/participant/CancelEnrollmentUseCase.js'
import EnrollInEventUseCase from '../../use_cases/participant/EnrollInEventUseCase.js'
import type { UpdateParticipantDto } from '../../dtos/participant/UpdateParticipantDto.js'

export default class ParticipantController {
  private participantRepo = new ParticipantRepository()
  private eventRepo = new EventRepository()
  private updateUseCase = new UpdateParticipantUseCase()
  private getEventsUseCase = new GetParticipantEventsUseCase()
  private cancelEnrollmentUseCase = new CancelEnrollmentUseCase(this.participantRepo)
  private enrollInEventUseCase = new EnrollInEventUseCase(this.participantRepo, this.eventRepo)

  public async updateParticipant({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const participant = await this.participantRepo.findByUserId(user.id)
      if (!participant) return response.notFound({ message: 'Participante não encontrado' })

      const payload: UpdateParticipantDto = request.only(['name', 'email', 'password'])

      if (!payload || Object.keys(payload).length === 0) {
        return response.badRequest({ message: 'Nenhum campo para atualizar' })
      }

      const updated = await this.updateUseCase.run(participant.id, user.id, payload)

      return response.ok({ participant: updated })
    } catch (error: any) {
      if (error.message === 'CPF already in use')
        return response.conflict({ message: 'CPF já está em uso' })
      if (error.message === 'Not allowed') return response.forbidden({ message: 'Não permitido' })
      if (error.message === 'Participant not found')
        return response.notFound({ message: 'Participante não encontrado' })

      return response
        .status(400)
        .send({ message: error.message || 'Erro ao atualizar participante' })
    }
  }

  public async getMyEvents({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const events = await this.getEventsUseCase.run(user.id)

      return response.ok({ events })
    } catch (error: any) {
      if (error.message === 'Participant not found')
        return response.notFound({ message: 'Participante não encontrado' })

      return response.status(400).send({ message: error.message || 'Erro ao buscar eventos' })
    }
  }

  public async cancelEnrollment({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const eventId = params.eventId
      if (!eventId) return response.badRequest({ message: 'ID do evento é obrigatório' })

      await this.cancelEnrollmentUseCase.execute(user.id, Number(eventId))

      return response.ok({ message: 'Inscrição cancelada com sucesso' })
    } catch (error: any) {
      if (error.message === 'Participant not found')
        return response.notFound({ message: 'Participante não encontrado' })

      return response.status(400).send({ message: error.message || 'Erro ao cancelar inscrição' })
    }
  }

  public async enrollInEvent({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.unauthorized({ message: 'Não autenticado' })

      const { eventId } = request.only(['eventId'])
      if (!eventId) return response.badRequest({ message: 'ID do evento é obrigatório' })

      await this.enrollInEventUseCase.execute(user.id, Number(eventId))

      return response.created({ message: 'Inscrito no evento com sucesso' })
    } catch (error: any) {
      if (error.message === 'Participant not found')
        return response.notFound({ message: 'Participante não encontrado' })
      if (error.message === 'Event not found')
        return response.notFound({ message: 'Evento não encontrado' })
      if (error.message === 'Already enrolled in this event')
        return response.conflict({ message: 'Já inscrito neste evento' })
      if (error.message === 'Event is full')
        return response.conflict({ message: 'Evento está lotado' })
      if (error.message === 'Schedule conflict: you already have an event at this time')
        return response.conflict({
          message: 'Conflito de horário: você já tem um evento neste horário',
        })

      return response
        .status(400)
        .send({ message: error.message || 'Erro ao se inscrever no evento' })
    }
  }
}
