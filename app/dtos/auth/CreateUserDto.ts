import { UserRole } from '../../utils/enums.js'

export interface CreateUserDto {
  password: string
  role: UserRole
  email?: string
}
