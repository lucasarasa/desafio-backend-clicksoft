import User from '#models/user'
import Hash from '@adonisjs/core/services/hash'
import { SignInDto } from '../../dtos/auth/SignInDto.js'
import Participant from '#models/participants'
import Organizer from '#models/organizer'

export default class SignInUseCase {
  constructor() {}

  async execute(dto: SignInDto) {
    const email = dto.email.trim().toLowerCase()

    const user = await User.query().where('email', email).first()
    if (!user) {
      throw new Error('User not found')
    }

    console.log('Usuário encontrado:', user)
    console.log('DEBUG HASH')
    console.log('Senha enviada:', dto.password)
    console.log('Hash armazenado:', user.password)

    const testHash = await Hash.use('scrypt').make(dto.password)
    console.log('Novo hash criado com a mesma senha:', testHash)

    const isValid = await Hash.verify(user.password, dto.password)
    console.log('Senha válida?', isValid)

    const testVerify = await Hash.verify(testHash, dto.password)
    console.log('Hash de teste verifica?', testVerify)

    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    let tokenName = 'signin'
    const participant = await Participant.query().where('user_id', user.id).first()
    if (participant && participant.name) tokenName = participant.name
    else {
      const organizer = await Organizer.query().where('user_id', user.id).first()
      if (organizer && organizer.name) tokenName = organizer.name
    }

    const tokenInstance = await User.accessTokens.create(user, ['*'], {
      name: tokenName,
      expiresIn: '2h',
    })
    const plainToken = tokenInstance.toJSON().token

    return { user, token: plainToken }
  }
}
