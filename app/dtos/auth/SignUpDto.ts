import { UserRole } from "../../utils/enums.js"

export interface SignUpDto {
  name: string
  email: string
  password: string
  role: UserRole
  cpf: string
}