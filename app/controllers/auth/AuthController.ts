import type { HttpContext } from '@adonisjs/core/http'
import { signInValidator, signUpValidator } from '#validators/auth/auth_validator'
import SignInUseCase from '../../use_cases/auth/SignInUseCase.js'
import { SignUpDto } from '../../dtos/auth/SignUpDto.js'
import SignUpUseCase from '../../use_cases/auth/SignUpUseCase.js'

export default class AuthController {
  private signInUseCase = new SignInUseCase()
  private signUpUseCase = new SignUpUseCase()

  public async signIn({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signInValidator)

    try {
      const result = await this.signInUseCase.execute(payload)
      return response.ok(result)
    } catch (error: any) {
      return response.unauthorized({ message: 'Credenciais inválidas' })
    }
  }

  public async signUp({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(signUpValidator)

      const dto: SignUpDto = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        cpf: data.cpf,
      }

      const result = await this.signUpUseCase.run(dto)

      return response.created(result)
    } catch (error: any) {
      if (error.messages) {
        return response.status(422).send({
          errors: error.messages,
          message: 'CPF deve ter exatamente 11 caracteres e deve conter somente números',
        })
      }
      return response
        .status(400)
        .send({ message: error.message, messages: 'Erro ao cadastrar usuário' })
    }
  }
}
