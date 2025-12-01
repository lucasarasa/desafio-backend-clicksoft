import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth/AuthController'
import ParticipantController from '#controllers/participant/ParticipantController'
import OrganizerController from '#controllers/organizer/OrganizerController'
import { middleware } from '#start/kernel'

// ========== AUTH ROUTES ==========
router
  .group(() => {
    router.post('/signup', async (ctx) => {
      const controller = new AuthController()
      return controller.signUp(ctx)
    })

    router.post('/signin', async (ctx) => {
      const controller = new AuthController()
      return controller.signIn(ctx)
    })
  })
  .prefix('/auth')

// ========== PARTICIPANT ROUTES ==========
router
  .group(() => {
    router.patch('/me', async (ctx) => {
      const controller = new ParticipantController()
      return controller.updateParticipant(ctx)
    })

    router.post('/me/events', async (ctx) => {
      const controller = new ParticipantController()
      return controller.enrollInEvent(ctx)
    })

    router.get('/me/events', async (ctx) => {
      const controller = new ParticipantController()
      return controller.getMyEvents(ctx)
    })

    router.delete('/me/events/:eventId', async (ctx) => {
      const controller = new ParticipantController()
      return controller.cancelEnrollment(ctx)
    })
  })
  .prefix('/participants')
  .middleware([middleware.auth()])

// ========== ORGANIZER ROUTES ==========
router
  .group(() => {
    router.post('/events', async (ctx) => {
      const controller = new OrganizerController()
      return controller.createEvent(ctx)
    })

    router.patch('/events/:id', async (ctx) => {
      const controller = new OrganizerController()
      return controller.updateEvent(ctx)
    })

    router.delete('/events/:id', async (ctx) => {
      const controller = new OrganizerController()
      return controller.deleteEvent(ctx)
    })

    router.get('/events/:id/participants', async (ctx) => {
      const controller = new OrganizerController()
      return controller.getEventParticipants(ctx)
    })
  })
  .prefix('/organizers')
  .middleware([middleware.auth()])
